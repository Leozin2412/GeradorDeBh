import { stringify } from "querystring";
//import prisma from "../util/prismaclient.js";
import { PrismaClient } from '../../generated/prisma/index.js';
const prisma=new PrismaClient()
const TSrepo={
    async importTS(seguradora,segurado,sinistro,processo,DtInicial,DtFinal,desc,incidencia,executante){
               // const sinistroString=stringify(sinistro)
               
                const importTS=await prisma.timesheet.create({
                    data:{
                    Seguradora: seguradora,
                    Segurado: segurado,
                    Sinistro: sinistro,
                    NTradsul: processo,
                    DtInicial: DtInicial,
                    DtFinal: DtFinal,
                    Descricao: desc,
                    TpIncidencia: incidencia,
                    Executante: executante,
                    }
                })
                    return  importTS;
    },

    async selectTS(processo,DtInicialL,DtFinalL){

        const selectTS= prisma.timesheet.findMany(
           { where:{
                NTradsul:processo,
                DtInicial:{gte:DtInicialL},
                DtFinal:{lte:DtFinalL}
            },
            select:{
                Seguradora:true,
                Segurado:true,
                Sinistro:true,
                NTradsul:true,
                DtInicial:true,
                DtFinal:true,
                Descricao:true,
                TpIncidencia:true,
                Executante:true
            },
            orderBy:{
                    DtInicial:'desc'
            }

            }
        )

        return selectTS
    
    }
    
}


export default TSrepo
        


    


    



