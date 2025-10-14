import {Router} from 'express'
import TScontroller from '../controller/TScontroller.js'

const routes=Router()

routes.post("/ts/import",TScontroller.importTS)




export default routes