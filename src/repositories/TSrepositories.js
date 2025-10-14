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

        


    }

}


export default TSrepo
        


    


    



