// import AuthApiRoute from "./AuthRoute.js";
import courierRoutes from "./courierRoute.js";
import documentRoutes from "./documentRoute.js";
import typeDocumentRoutes from "./typeDocumentRoute.js";
import TypeCourrierRoutes from "./typeCourrierRoute.js";
import archiveRoutes from "./archiveRoute.js";
import uploadRoutes from "./uploadRoute.js";
import historiqueCourrierRoutes from "./historiqueCourrierRoute.js";


const ApiRoutes = (app) => {
    app.use(courierRoutes); // Route pour les courriers
    app.use(documentRoutes);
    app.use(typeDocumentRoutes);
    app.use(TypeCourrierRoutes);
    app.use(archiveRoutes); // Route pour les archivesessagerieRoutes); // Route pour la messagerie
    app.use(historiqueCourrierRoutes);

    app.use(uploadRoutes);
};
export default ApiRoutes