import prisma from "../util/prismaclient.js";
const TSrepo={
    async importTS(processo,DtInicial,DtFinal,desc,incidencia,executante){
                const importTS=await prisma.timesheet.create({
                    data:{
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

    async selectTS(processo,DtInicial,DtFinal){

        const selectTS= prisma.timesheet.findMany(
           { where:{
                NTradsul:processo,
                DtInicial:{gte:DtInicial},
                DtFinal:{lte:DtFinal}
            },
            select:{
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
        


    


    



