export class TokenModel {
  public Token!: string;
  public Status!: string;

  constructor(data?: any) {
    this.Token = data['Token'] ? data['Token'] : '';
    this.Status = data['Status'] ? data['Status'] : '';
  }
}
