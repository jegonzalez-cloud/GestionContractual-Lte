export class EntidadesModel {
  public usuario!: string;  
  public documento!: string;  
  public entidad!: string;  
  public equipo!: string;  
  public unidad!: string;  

  constructor(data?: any) {
    this.usuario = data['usuario'] ? data['usuario'] : '';    
    this.documento = data['documento'] ? data['documento'] : '';    
    this.entidad = data['entidad'] ? data['entidad'] : '';    
    this.equipo = data['equipo'] ? data['equipo'] : '';    
    this.unidad = data['unidad'] ? data['unidad'] : '';    
  }
}
