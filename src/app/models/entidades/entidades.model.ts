export class EntidadesModel {
  public usuario!: string;
  public documento!: string;
  public tipoEntidad!: string;
  public entidad!: string;
  public equipo!: string;
  public unidad!: string;
  public codigoEntidad!: string;

  constructor(data?: any) {
    this.usuario = data['usuario'] ? data['usuario'] : '';
    this.documento = data['documento'] ? data['documento'] : '';
    this.tipoEntidad = data['tipoEntidad'] ? data['tipoEntidad'] : '';
    this.entidad = data['entidad'] ? data['entidad'] : '';
    this.equipo = data['equipo'] ? data['equipo'] : '';
    this.unidad = data['unidad'] ? data['unidad'] : '';
    this.codigoEntidad = data['codigoEntidad'] ? data['codigoEntidad'] : '';

  }
}
