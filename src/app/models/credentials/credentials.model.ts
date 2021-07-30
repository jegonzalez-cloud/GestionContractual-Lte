export class CredentialsModel {
    public Username!: string;
    public Password!: string;
  
    constructor(data?: any) {
      this.Username = data['Username'] ? data['Username'] : '';
      this.Password = data['Password'] ? data['Password'] : '';
    }
  }
  