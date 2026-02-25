import { readFile } from "node:fs/promises";
interface UploadUrl { url: string }
type uploadType = "file" | "image"

export class MaxBotExaple{
  DEFAULT_TIMEOUT: number;
  baseURL: string;  
  uploadPath: string;
  botToken: string;
  // botID: string;

  constructor(token:string){
    this.DEFAULT_TIMEOUT = 500;
    this.baseURL = "https://platform-api.max.ru"
    this.uploadPath = "/uploads"
    this.botToken = token
    // this.botID = id
  }

  private async _getUploadUrl( type:uploadType ):Promise<string>{ 
    
    const typeParam = `?type=${type}`
    const response = await fetch(this.baseURL + this.uploadPath + typeParam, {
      method: "POST",
      headers: { 
        "Authorization": this.botToken 
      }
    })

    if(!response.ok) throw new Error(`Ошибка: ${response.status}`)

    const data =this._mapToUploadUrl(await response.json())
    
    return data.url
  }

  private _mapToUploadUrl(data:any): UploadUrl {
      if((typeof data == "object" && typeof(data.url)=="string"))
        return { url: data.url }
      throw new Error("Не удалось получить url для загрузки")
  }

  private async _sleep(ms: number) { 
    return new Promise(resolve => setTimeout(resolve, ms)); 
  }

  async uploadFile(srcPath:string, type: uploadType){
    const uploadUrl = await this._getUploadUrl(type)
    const formDataFile = new FormData();
    const buffer = await readFile(srcPath)
    const blob = new Blob([buffer]);
    const photoName = srcPath.replace(/.*\//g,'')

    formDataFile.append(type, blob, photoName); 

    const attachmentsResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: { 
        "Authorization": this.botToken    
      },
      body: formDataFile
    })

    if(!attachmentsResponse.ok) throw new Error(`Ошибка: ${attachmentsResponse.status}`);

    const attachment = await attachmentsResponse.json()
    
    return {attachment, type}
  }

  private async _sendMessageTo(urlPath:string, message: string, attachments?: {attachment: unknown, type: uploadType}[]): Promise<any>{

    const mapAttachments = attachments?.map(a=>{
      return {
        type: a.type,
        payload: a.attachment
      }
    })
    let attacheResponse: Response;
    let response: any;
    let timeout = this.DEFAULT_TIMEOUT
    do{
      if(Array.isArray(attachments)&& attachments.length!==0){
        timeout*=2
        await this._sleep(timeout);
      } 
      attacheResponse = await fetch(this.baseURL+urlPath, {
        method: 'POST',
        headers: {"Authorization": this.botToken, "Content-Type": "application/json"},
        body: JSON.stringify({
          text: message,
          attachments: mapAttachments
        })
      })
      
      response =  await attacheResponse.json() 
      
    }while(response?.code=="attachment.not.ready")
    
    return response
  }

  async sendMessageToUser(userID: number, message: string, attachments?: {attachment: unknown, type: uploadType} []){
    const userPath = `/messages?user_id=${userID}`

    return await this._sendMessageTo(userPath, message, attachments)
  }

  async sendMessageToChat(chatID: number, message: string, attachments?: {attachment: unknown, type: uploadType} []){
    const chatPath = `/messages?chat_id=${chatID}`

    return await this._sendMessageTo(chatPath, message, attachments)
  }

}