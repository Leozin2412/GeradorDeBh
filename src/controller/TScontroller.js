import TSrepo from "../repositories/TSrepositories.js";


 const TScontroller={
     importTS:async (req,res)=>{
        try{
            const{processo,DtInicial,DtFinal,desc,incidencia,executante}=req.body;
            const msgErrors=[];

            if(!processo) msgErrors.push("Processo não informado")
            if(!DtInicial) msgErrors.push("Data Inicial não informada")
            if(!DtFinal)msgErrors.push("Data Final não informada")
            if(!desc)msgErrors.push("Descrição não informada")
            if(!incidencia)msgErrors.push("Tipo de Incidência não informado")
            if(!executante)msgErrors.push("Perito não informado")

            if (msgErrors.length > 0) {
            return res.status(400).json({ ok: false, message: msgErrors.join(', ') });
            }
            await TSrepo.importTS(processo,DtInicial,DtFinal,desc,incidencia,executante)
          const TSimportado=  await TSrepo.importTS(processo,DtInicial,DtFinal,desc,incidencia,executante)
            return res.status(200).json({ok:true, message:"Timesheets importados com sucesso",data:TSimportado})

        }catch(error){
            console.error("Erro ao importa TimeSheets",error);
            return res.status(500).json({ok:false, message:"Erro ao importa TimeSheets"}) 
        }
    },

    selectTS: async(req,res)=>{
       try{
            const{processo,DtInicial,DtFinal}=req.body;
            const msgErrors=[];

            if(!processo) msgErrors.push("Processo não informado")
            if(!DtInicial) msgErrors.push("Data Inicial não informada")
            if(!DtFinal)msgErrors.push("Data Final não informada")
            
                const DtInicialL= new Date(DtInicial)
                const DtFinalL= new Date(DtFinal)

            if (msgErrors.length > 0) {
            return res.status(400).json({ ok: false, message: msgErrors.join(', ') });
            }

            const TSfiltrado=await TSrepo.selectTS(processo,DtInicialL,DtFinalL)
            return res.status(200).json({ok:true, message:"Timesheets selecionados com sucesso!",data:TSfiltrado})
            
        }catch(error){
            console.error("Erro ao importa TimeSheets",error);
            return res.status(500).json({ok:false, message:"Erro ao importa TimeSheets"}) 
        }  
    }


}
export default TScontroller

 

