"use client";

import * as React from "react";

type ToastVariant = "default" | "success" | "destructive";

interface ToastData {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  action?: React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

let count = 0;
function genId() { return `toast-${++count}`; }

type Action =
  | { type: "ADD"; toast: ToastData }
  | { type: "UPDATE"; toast: Partial<ToastData> & Pick<ToastData, "id"> }
  | { type: "DISMISS"; toastId?: string }
  | { type: "REMOVE"; toastId?: string };

const TOAST_LIMIT = 3;
const TOAST_REMOVE_DELAY = 4000;

interface State { toasts: ToastData[] }

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

function addToRemoveQueue(toastId: string, dispatch: React.Dispatch<Action>) {
  if (toastTimeouts.has(toastId)) return;
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({ type: "REMOVE", toastId });
  }, TOAST_REMOVE_DELAY);
  toastTimeouts.set(toastId, timeout);
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD":
      return { ...state, toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT) };
    case "UPDATE":
      return { ...state, toasts: state.toasts.map((t) => t.id === action.toast.id ? { ...t, ...action.toast } : t) };
    case "DISMISS":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          (!action.toastId || t.id === action.toastId) ? { ...t, open: false } : t
        ),
      };
    case "REMOVE":
      return action.toastId
        ? { ...state, toasts: state.toasts.filter((t) => t.id !== action.toastId) }
        : { ...state, toasts: [] };
  }
}

let listeners: Array<(state: State) => void> = [];
let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((l) => l(memoryState));
}

type ToastOptions = Omit<ToastData, "id">;

function toast(opts: ToastOptions) {
  const id = genId();
  const update = (o: ToastOptions) => dispatch({ type: "UPDATE", toast: { ...o, id } });
  const dismiss = () => dispatch({ type: "DISMISS", toastId: id });

  dispatch({
    type: "ADD",
    toast: { ...opts, id, open: true, onOpenChange: (open) => { if (!open) dismiss(); } },
  });

  return { id, dismiss, update };
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => { listeners = listeners.filter((l) => l !== setState); };
  }, [state]);

  React.useEffect(() => {
    state.toasts.forEach((t) => {
      if (t.open === false) addToRemoveQueue(t.id, dispatch);
    });
  }, [state.toasts]);

  return { ...state, toast, dismiss: (id?: string) => dispatch({ type: "DISMISS", toastId: id }) };
}

export { useToast, toast };
