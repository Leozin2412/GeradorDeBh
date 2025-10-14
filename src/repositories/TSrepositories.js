import prisma from "../util/prismaclient.js";
const TSrepo={
    async importTS(segurado,sinistro,processo,DtInicial,DtFinal,desc,incidencia,executante){
                const importTS=await prisma.timesheet.create({
                    data:{
                        Segurado:segurado,
                        Sinistro:sinistro,
                        NTradsul:processo,
                        DtInicial:DtInicial,
                        DtFinal:DtFinal,
                        Descricao:desc,
                        TpIncidencia:incidencia,
                        Executante:executante
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
                Segurado:true,
                Sinistro:true,
                NTradsul:true,
                DtInicial:true,
                DtFinal:true,
                Descricao:true,
                TpIncidencia:true,
                Executante:true
            }

            }
        )

        return selectTS
    
    }
    
}


export default TSrepo
        


    


    



