export const SENATORIAL_ZONES = {
  "Ogun Central": [
    { value: "abeokuta_north", label: "Abeokuta North" },
    { value: "abeokuta_south", label: "Abeokuta South" },
    { value: "ewekoro", label: "Ewekoro" },
    { value: "ifo", label: "Ifo" },
    { value: "obafemi_owode", label: "Obafemi-Owode" },
    { value: "odeda", label: "Odeda" },
  ],
  "Ogun East": [
    { value: "ijebu_east", label: "Ijebu East" },
    { value: "ijebu_north", label: "Ijebu North" },
    { value: "ijebu_north_east", label: "Ijebu North East" },
    { value: "ijebu_ode", label: "Ijebu Ode" },
    { value: "ikenne", label: "Ikenne" },
    { value: "odogbolu", label: "Odogbolu" },
    { value: "ogun_waterside", label: "Ogun Waterside" },
    { value: "remo_north", label: "Remo North" },
    { value: "sagamu", label: "Sagamu" },
  ],
  "Ogun West": [
    { value: "ado_odo_ota", label: "Ado-Odo/Ota" },
    { value: "yewa_north", label: "Yewa North (Egbado North)" },
    { value: "yewa_south", label: "Yewa South (Egbado South)" },
    { value: "imeko_afon", label: "Imeko-Afon" },
    { value: "ipokia", label: "Ipokia" },
  ],
};

export const ALL_LGAS = Object.values(SENATORIAL_ZONES).flat();

export const LGA_MAP = Object.fromEntries(
  ALL_LGAS.map((l) => [l.value, l.label])
);
