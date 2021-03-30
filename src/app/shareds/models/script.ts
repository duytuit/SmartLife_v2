import { scriptdevice } from './scriptdevice'

export class scripts {
     id:string
     type_script:string
     name_script:string
     device_conditional:string
     device_conditional_switch:string
     device_conditional_switch_status:boolean
     note:string
     status:boolean
     userid_by:string
     created_by:string
     deviceid:string
     device_action:scriptdevice[]
}