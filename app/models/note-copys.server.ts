// Defaults de los copys personalizables por lista (modelo Note).
// Cuando el campo en la Note es null, la app cae a estos strings.
// Centralizados acá para no esparcir literales por el render.

export const DEFAULT_PRE_ASSIGN_COPY = "Me va a encantar";

export const DEFAULT_SUCCESS_THANKS_COPY =
  "¿Llorando yo? Bah, estás loco. Me entró una pelusa 😏.";

// introSignerName no tiene default propio: si está vacío, la UI deriva el
// nombre del título de la lista (ver nombreDelDueno en cada route).
export const DEFAULT_INTRO_SIGNER_NAME = null;
