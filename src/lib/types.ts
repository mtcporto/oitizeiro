export interface OitizeiroRecord {
  id: string;
  "Nome Completo": string;
  CPF: string;
  Atividade: string;
  Local: string;
  Tempo: string;
  Endereço: string;
  Bairro: string;
  Cidade: string;
  Telefone: string;
  "OBS.": string;
  "Responsável pelo cadastro": string;
  deletedAt?: string | null;
}
