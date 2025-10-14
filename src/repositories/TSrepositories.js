import prisma from "../util/prismaclient.js";
const TSrepo={
    async importTS(processo,DTinicial,DTfinal,desc,incidencia,executante){
                const importTS=await prisma.timesheet.create({
                    data:{
                        NTradsul:processo,
                        DtInicial:DTinicial,
                        DtFinal:DTfinal,
                        Descricao:desc,
                        TpIncidencia:incidencia,
                        Executante:executante
                    }
                })
                    return  importTS;
    }

}


export default TSrepo
        


    


    



