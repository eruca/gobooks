const port = '8080';
export const websocketAddr = `ws://${document.location.hostname}:${port}/ws`;
export const httpAddr = `http://${document.location.hostname}:${port}`;
export const success_end = '_success';
export const fail_end = '_failure';
export const defaultDrawerWidth = 320;
export const version = '0.0.1';

export const tag = '标签';
export const diagnose = '诊断';
export const monitor_bacteria = '耐药菌';
export const department = '科室';
export const patients_results = '病人转归';
export const doctors = '医生';
export const nurses = '护士';

export const dicts_categorys = [
    tag,
    diagnose,
    monitor_bacteria,
    department,
    patients_results,
    doctors,
    nurses,
];
