export const ok = <T>(data: T) => ({ data, error: null });
export const err = (message: string) => ({ data: null, error: message });
