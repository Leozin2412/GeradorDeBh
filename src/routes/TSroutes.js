import {Router} from 'express'
import TScontroller from '../controller/TScontroller.js'
import multer from 'multer'

const storage = multer.memoryStorage();
const upload = multer({ storage: storage })
const routes=Router()

routes.post("/ts/import",upload.single('arquivoExcel'),TScontroller.importActivities)
routes.get("/ts/select", TScontroller.selectTS)
routes.post("/ts/export",TScontroller.exportTS)


export default routes