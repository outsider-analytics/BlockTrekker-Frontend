import { RequestTypes, serverRequest } from "./serverRequest";

export const addVisualizationToDashboard = (user: string, visualization: any): Promise<Response> =>
    serverRequest(`dashboard/visualization/${user}`, RequestTypes.Post, visualization);

export const getDashboard = (user: string): Promise<Response> =>
    serverRequest(`dashboard/${user}`);

export const saveDashboard = (user: string, payload: any): Promise<Response> =>
    serverRequest(`dashboard/save/${user}`, RequestTypes.Post, payload);