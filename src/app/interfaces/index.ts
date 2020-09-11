export interface Employee {
    id: number,
    nik: string,
    name: string,
    type: string,
    positionId: string | number,
    divisionId: string | number,
    lastPosition: string,
    createdDate: string
}

export interface Position {
    id: number,
    level: number,
    name: string
}

export interface Division {
    id: number,
    name: string
}