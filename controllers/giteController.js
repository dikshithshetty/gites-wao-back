import Gite from '../models/giteModel.js';
import Photo from '../models/photoModel.js';
import asyncHandler from 'express-async-handler';
import slugify from 'slugify';
import stripHtml from 'string-strip-html';
import formidable from 'formidable';
import fs from 'fs';
import _ from 'lodash';
import QR from '../models/QRModel.js';

// @desc      Fetch all gites
// @route     GET /api/gites
// @access    Public
const getGites = asyncHandler(async (req, res) => {
	const gites = await Gite.find({});
	res.json(gites);
});

// @desc      Fetch all gites name
// @route     GET /api/gites/noms
// @access    Public
const getGitesNoms = asyncHandler(async (req, res) => {
	const gites = await Gite.find({}).select('nom slug');
	res.json(gites);
});

// @desc      Fetch gite by nom
// @route     GET /api/gites/:slug
// @access    Public
const getGiteByNom = asyncHandler(async (req, res) => {
	const slug = req.params.slug;
	const gite = await Gite.findOne({ slug });
	res.json(gite);
});

// @desc      Fetch gite by nom
// @route     GET /api/gite/id/:id
// @access    Public
const getGiteById = asyncHandler(async (req, res) => {
	const gite = await Gite.findById(req.params.id);
	res.json(gite);
});

// @desc      Fetch photos by nom
// @route     GET /api/photos/:nom
// @access    Public
const getPhotosByNom = asyncHandler(async (req, res) => {
	const nom = req.params.nom;
	const gite = await Photo.find({ pageAssociee: nom });
	res.json(gite);
});

// @desc      Fetch photos by id
// @route     GET /api/photo/:id
// @access    Public
const getPhotoById = asyncHandler(async (req, res) => {
	const photo = await Photo.findById(req.params.id);
	res.json(photo);
});

// @desc      Fetch photos by nom
// @route     GET /api/photos/section/:section
// @access    Public
const getPhotosBySection = asyncHandler(async (req, res) => {
	const section = req.params.section;
	const photos = await Photo.find({ sectionAssociee: section });
	res.json(photos);
});

// @desc      Delete a Gite
// @route     DELETE /api/gites/:slug
// @access    Private/Admin
const deleteGite = asyncHandler(async (req, res) => {
	const slug = req.params.slug.toLowerCase();
	const gite = await Gite.findOne({ slug });

	if (gite) {
		await gite.remove();
		res.json({ message: 'Ce gîte a bien été supprimé' });
	} else {
		res.status(404);
		throw new Error('Gite non trouvé');
	}
});

// @desc      Create a Gite
// @route     POST /api/gite
// @access    Private/Admin
const createGite = (req, res) => {
	const {
		nom,
		adresse,
		cp,
		ville,
		capaciteMax,
		actif,
		mtitle,
		presGiteSEO,
		couleur1,
		couleur2,
		videoLink,
		texteExterieur,
		equipementExterieur,
		texteInterieur,
		equipementInterieur,
		textePiscine,
		equipementPiscine,
		texte,
		detailGite,
		calendrierLink,
		tarifDeBase,
		nPers,
		supplementParPers,
		tarifParPersParNuit,
		ftMenage,
		ftLit,
		troisNuitees,
		quatreNuitees,
		uneNuitee,
		basseSaison,
		moyenneSaison,
		hauteSaison,
		noel,
		nouvelAn,
	} = req.body;

	let arrayOfEquipementExterieur =
		equipementExterieur && equipementExterieur.split(',');
	let arrayOfEquipementInterieur =
		equipementInterieur && equipementInterieur.split(',');
	let arrayOfEquipementPiscine =
		equipementPiscine && equipementPiscine.split(',');

	const gite = new Gite({
		nom,
		adresse,
		cp,
		ville,
		capaciteMax,
		actif,
		mtitle,
		presGiteSEO,
		mdesc: stripHtml(presGiteSEO.substring(0, 160)),
		slug: slugify(nom).toLowerCase(),
		couleur1,
		couleur2,
		videoLink,
		texteExterieur,
		equipementExterieur: arrayOfEquipementExterieur,
		texteInterieur,
		equipementInterieur: arrayOfEquipementInterieur,
		textePiscine,
		equipementPiscine: arrayOfEquipementPiscine,
		texte,
		detailGite,
		calendrierLink,
		tarifDeBase,
		nPers,
		supplementParPers,
		tarifParPersParNuit,
		ftMenage,
		ftLit,
		troisNuitees,
		quatreNuitees,
		uneNuitee,
		basseSaison,
		moyenneSaison,
		hauteSaison,
		noel,
		nouvelAn,
	});

	console.log('gite dans le back', gite);

	gite.save((error, gite) => {
		if (error) return res.status(400).json({ error });
		if (gite) {
			res.status(201).json({ gite, message: 'Le gîte a bien été créé' });
		}
	});
};

// @desc      Update a Gite
// @route     PUT /api/gites/:slug
// @access    Private/Admin
const updateGite = asyncHandler(async (req, res) => {
	const {
		nom,
		adresse,
		cp,
		ville,
		capaciteMax,
		actif,
		mtitle,
		presGiteSEO,
		couleur1,
		couleur2,
		videoLink,
		texteExterieur,
		equipementExterieur,
		texteInterieur,
		equipementInterieur,
		textePiscine,
		equipementPiscine,
		texte,
		detailGite,
		calendrierLink,
		tarifDeBase,
		nPers,
		supplementParPers,
		tarifParPersParNuit,
		ftMenage,
		ftLit,
		caution,
		troisNuitees,
		quatreNuitees,
		uneNuitee,
		basseSaison,
		moyenneSaison,
		hauteSaison,
		noel,
		nouvelAn,
		ctDesignationTitre,
		ctPrincipCarac,
		ctSituLog,
		ctDescLog,
		nbKmDeLaMaison,
	} = req.body;
	console.log(equipementExterieur);
	const gite = await Gite.findById(req.params.id);

	if (gite) {
		let arrayOfEquipementExterieur = [];
		equipementExterieur &&
			(arrayOfEquipementExterieur = equipementExterieur.split(','));
		gite.equipementExterieur = arrayOfEquipementExterieur;
		let arrayOfEquipementInterieur = [];
		equipementInterieur &&
			(arrayOfEquipementInterieur = equipementInterieur.split(','));
		gite.equipementInterieur = arrayOfEquipementInterieur;
		let arrayOfEquipementPiscine = [];
		equipementPiscine &&
			(arrayOfEquipementPiscine = equipementPiscine.split(','));
		gite.equipementPiscine = arrayOfEquipementPiscine;

		console.log(arrayOfEquipementExterieur);

		nom && (gite.nom = nom);
		adresse && (gite.adresse = adresse);
		cp && (gite.cp = cp);
		ville && (gite.ville = ville);
		capaciteMax && (gite.capaciteMax = capaciteMax);
		actif && (gite.actif = actif);
		mtitle && (gite.mtitle = mtitle);
		presGiteSEO && (gite.presGiteSEO = presGiteSEO);
		presGiteSEO && (gite.mdesc = stripHtml(presGiteSEO.substring(0, 160)));
		nom && (gite.slug = slugify(nom).toLowerCase());
		couleur1 && (gite.couleur1 = couleur1);
		couleur2 && (gite.couleur2 = couleur2);
		videoLink && (gite.videoLink = videoLink);
		texteExterieur && (gite.texteExterieur = texteExterieur);
		nom && (gite.equipementExterieur = arrayOfEquipementExterieur);
		texteInterieur && (gite.texteInterieur = texteInterieur);
		nom && (gite.equipementInterieur = arrayOfEquipementInterieur);
		textePiscine && (gite.textePiscine = textePiscine);
		nom && (gite.equipementPiscine = arrayOfEquipementPiscine);
		texte && (gite.texte = texte);
		detailGite && (gite.detailGite = detailGite);
		calendrierLink && (gite.calendrierLink = calendrierLink);
		tarifDeBase && (gite.tarifDeBase = tarifDeBase);
		nPers && (gite.nPers = nPers);
		supplementParPers && (gite.supplementParPers = supplementParPers);
		tarifParPersParNuit && (gite.tarifParPersParNuit = tarifParPersParNuit);
		ftMenage && (gite.ftMenage = ftMenage);
		ftLit && (gite.ftLit = ftLit);
		caution && (gite.caution = caution);
		troisNuitees && (gite.coefficients.troisNuitees = troisNuitees);
		quatreNuitees && (gite.coefficients.quatreNuitees = quatreNuitees);
		uneNuitee && (gite.coefficients.uneNuitee = uneNuitee);
		basseSaison && (gite.coefficients.basseSaison = basseSaison);
		moyenneSaison && (gite.coefficients.moyenneSaison = moyenneSaison);
		hauteSaison && (gite.coefficients.hauteSaison = hauteSaison);
		noel && (gite.coefficients.noel = noel);
		nouvelAn && (gite.coefficients.nouvelAn = nouvelAn);
		ctDesignationTitre && (gite.ctDesignationTitre = ctDesignationTitre);
		ctPrincipCarac && (gite.ctPrincipCarac = ctPrincipCarac);
		ctSituLog && (gite.ctSituLog = ctSituLog);
		ctDescLog && (gite.ctDescLog = ctDescLog);
		nbKmDeLaMaison && (gite.nbKmDeLaMaison = nbKmDeLaMaison);

		const updatedGite = await gite.save();
		res.json({
			updatedGite,
			message: 'Les modifications ont bien été prises en compte.',
		});
	} else {
		res.status(404);
		throw new Error('Gite non trouvé');
	}
});

// @desc      Fetch all photos
// @route     GET /api/photos
// @access    Public
const getAllPhotos = asyncHandler(async (req, res) => {
	const photos = await Photo.find({});
	res.json(photos);
});

// @desc      Fetch all QR
// @route     GET /api/qr
// @access    Private/Admin
const getAllQR = asyncHandler(async (req, res) => {
	const qrs = await QR.find({});
	res.json(qrs);
});

// @desc      Fetch one QR by Id
// @route     GET /api/qr/:id
// @access    Private/Admin
const getQRById = asyncHandler(async (req, res) => {
	const qr = await QR.findById(req.params.id);

	if (qr) {
		res.json(qr);
	} else {
		res.status(404);
		throw new Error('Q/R non trouvé');
	}
});

// @desc      Create a QR
// @route     POST /api/qr
// @access    Private/Admin
const createQR = (req, res) => {
	const { question, reponse } = req.body;

	// console.log('req', req);
	console.log('question', question);
	console.log('reponse', reponse);
	const qr = new QR({
		question,
		reponse,
	});

	console.log('QR dans le back', qr);

	qr.save((error, qr) => {
		if (error) return res.status(400).json({ error });
		if (qr) {
			res.status(201).json({
				qr,
				message: 'La Question/Réponse a bien été créée',
			});
		}
	});
};

// @desc      Delete a QR
// @route     GET /api/qr
// @access    Private/Admin
const removeQR = asyncHandler(async (req, res) => {
	const qr = await QR.findById(req.params.id);
	if (qr) {
		await qr.remove();
		res.json({
			message: 'Q/R correctement supprimée',
		});
	} else {
		return res.json({
			error: err,
		});
	}
});

// @desc      Update a QR
// @route     GET /api/qr
// @access    Private/Admin
const updateQR = asyncHandler(async (req, res) => {
	const { question, reponse } = req.body;

	const qr = await QR.findById(req.params.id);

	if (qr) {
		question && (review.question = question);
		reponse && (review.reponse = reponse);

		const updatedQr = await qr.save();
		res.json(updatedQr);
	} else {
		res.status(404);
		throw new Error('Q/R non trouvée');
	}
});

export {
	getGites,
	getGiteByNom,
	getGiteById,
	deleteGite,
	createGite,
	updateGite,
	getGitesNoms,
	getAllPhotos,
	getQRById,
	getAllQR,
	createQR,
	removeQR,
	updateQR,
	getPhotosByNom,
	getPhotosBySection,
	getPhotoById,
};
