


//import { PrismaClient } from '../../generated/prisma/index.js';
import { PrismaClient } from '@prisma/client';
const prisma=new PrismaClient()
const TSrepo={
    async importTS(seguradora,segurado,sinistroString,processo,DtInicial,DtFinal,descString,incidencia,executante){
               // const sinistroString=stringify(sinistro)
               
                const importTS=await prisma.timesheet.create({
                    data:{
                    Seguradora: seguradora,
                    Segurado: segurado,
                    Sinistro: sinistroString,
                    NTradsul: processo,
                    DtInicial: DtInicial,
                    DtFinal: DtFinal,
                    Descricao: descString,
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
                    DtInicial:'asc'
            }

            }
        )

        return selectTS
    
    }
    
}


export default TSrepo
        


    


    



