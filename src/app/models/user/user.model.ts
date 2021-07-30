export class UserModel {
  public CompanyName!: string;
  public CompanyID!: string;
  public IsVIP!: string;
  public LastName!: string;
  public Name!: string;
  public Username!: string;
  public Document!: string;

  constructor(data?: any) {
    this.CompanyName = data['CompanyName'] ? data['CompanyName'] : '';
    this.CompanyID = data['CompanyID'] ? data['CompanyID'] : '';
    this.IsVIP = data['IsVIP'] ? data['IsVIP'] : '';
    this.LastName = data['LastName'] ? data['LastName'] : '';
    this.Name = data['Name'] ? data['Name'] : '';
    this.Username = data['Username'] ? data['Username'] : '';
    this.Document = data['Document'] ? data['Document'] : '';
  }
}
