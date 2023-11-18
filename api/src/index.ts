import dotenv, { DotenvPopulateInput } from "dotenv"
import path from "path"

dotenv.populate(process.env as DotenvPopulateInput, { GOOGLE_APPLICATION_CREDENTIALS: path.resolve('../techify-ng-073c85f2027d.json') })

import { applicationDefault, initializeApp } from "firebase-admin/app"

initializeApp({
	credential: applicationDefault(),
	projectId: "techify-ng"
})

import "./main"
