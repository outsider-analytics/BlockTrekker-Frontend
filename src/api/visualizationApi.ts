import { RequestTypes, serverRequest } from "./serverRequest";


export const getAllVisualizations = async (user: string): Promise<Response> =>
    serverRequest(`visualization/all?user=${user}`);

export const saveVisualization = async (queryId: string, payload: any): Promise<Response> =>
    serverRequest(`visualization/save/${queryId}`, RequestTypes.Post, payload)

export const removeVisualization = async (queryId: string, vizPos: number): Promise<Response> =>
    serverRequest(`visualization/remove?queryId=${queryId}&vizPos=${vizPos}`, RequestTypes.Delete);