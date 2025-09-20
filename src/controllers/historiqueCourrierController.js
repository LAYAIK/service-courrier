import db from "../models/index.js";
const { HistoriqueCourrier } = db;

// // Create
// exports.createHistoriqueCourrier = async (req, res) => {
//     try {
//         const historique = await HistoriqueCourrier.create(req.body);
//         res.status(201).json(historique);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// Read All
export const getAllHistoriqueCourriers = async (req, res) => {
    try {
        const historiques = await HistoriqueCourrier.findAll();
        res.status(200).json(historiques);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// // Read One
// exports.getHistoriqueCourrierById = async (req, res) => {
//     try {
//         const historique = await HistoriqueCourrier.findById(req.params.id);
//         if (!historique) {
//             return res.status(404).json({ message: 'Not found' });
//         }
//         res.status(200).json(historique);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Update
// exports.updateHistoriqueCourrier = async (req, res) => {
//     try {
//         const historique = await HistoriqueCourrier.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true }
//         );
//         if (!historique) {
//             return res.status(404).json({ message: 'Not found' });
//         }
//         res.status(200).json(historique);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// // Delete
// exports.deleteHistoriqueCourrier = async (req, res) => {
//     try {
//         const historique = await HistoriqueCourrier.findByIdAndDelete(req.params.id);
//         if (!historique) {
//             return res.status(404).json({ message: 'Not found' });
//         }
//         res.status(200).json({ message: 'Deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };