import { Idoso } from "../entities/idoso.entity";

export interface IIdosoUsuario extends Idoso {
  usuario: IUsuario;
}

export interface IUsuario {
  id: number;
  nome: string;
  foto: Buffer;
  email: string;
  senha: string;
  admin: boolean;
}