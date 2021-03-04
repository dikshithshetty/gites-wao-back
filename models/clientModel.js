import mongoose from 'mongoose';

const clientSchema = mongoose.Schema(
	{
		civilite: { type: String },
		nom: { type: String, required: true },
		prenom: { type: String, required: true },
		adresse: { type: String, required: true },
		cp: { type: String, required: true },
		ville: { type: String, required: true },
		pays: { type: String, required: true },
		tel: { type: String, required: true },
		mail: { type: String, unique: true, required: true },
		nbVenu: { type: Number },
		nbReserv: { type: Number },
		commentaire: { type: String },
		newsletter: { type: Boolean },
		noteSpecifique: { type: String }, //Annotation en cas de mauvais payeur, client mécontent, etc...
	},
	{
		timestamps: true,
	}
);

const Client = mongoose.models.Client || mongoose.model('Client', clientSchema);

export default Client;
