require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload'); // Middleware para subida de archivos
const Gym = require('./models/Gym'); // Añadir esta línea
const Client = require('./models/Client'); // Añadir esta línea

const app = express();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');

const dbUri = process.env.MONGO_URI;
const port = process.env.APP_PORT || 3000;

mongoose.connect(dbUri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(fileUpload());

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

// Ruta de configuración
app.get('/config', async (req, res) => {
    const gym = await Gym.findOne();
    console.log('Gym data:', gym);
    res.render('config', {
        gymName: gym ? gym.name : 'Tu Gimnasio',
        backgroundColors: gym ? gym.backgroundColors : '#000000, #61430b, #e49d1a',
        titleColor: gym ? gym.titleColor : '#e4e01a', // Asegúrate de que titleColor esté aquí
        gymImage: gym ? gym.image : '/images/espartano.gif'
    });
});

// Ruta para actualizar la configuración
app.post('/config/update', async (req, res) => {
    const image = req.files?.gymImage;
    const { gymName, titleColor, backgroundColors } = req.body;
    console.log('Updating gym config:', { gymName, titleColor, backgroundColors });

    // Asegurarse de que titleColor sea un string
    const fixedTitleColor = Array.isArray(titleColor) ? titleColor[0] : titleColor;

    let gym = await Gym.findOne();
    if (!gym) {
        gym = new Gym();
    }
    gym.name = gymName;
    gym.titleColor = fixedTitleColor; // Usar el color corregido
    gym.backgroundColors = backgroundColors;

    if (image) {
        const imagePath = `./public/images/${image.name}`;
        image.mv(imagePath, (err) => {
            if (err) {
                console.error('Error al subir la imagen:', err);
                return res.status(500).send(err);
            }
            gym.image = `/images/${image.name}`;
            gym.save().then(() => res.redirect('/dashboard'));
        });
    } else {
        gym.save().then(() => res.redirect('/dashboard'));
    }
});




// Ruta de dashboard
app.get('/dashboard', async (req, res) => {
    try {
        const clients = await Client.find();
        const gym = await Gym.findOne();
        if (!gym) {
            console.log('No Gym document found');
            return res.status(404).send('No Gym document found');
        }
        console.log('Gym data:', gym); // Línea de depuración
        console.log('Title color:', gym.titleColor); // Línea de depuración

        res.render('dashboard', {
            clients,
            gymName: gym.name,
            backgroundColors: gym.backgroundColors,
            gymImage: gym.image,
            titleColor: gym.titleColor || '#e4e01a', // Asegúrate de que este valor por defecto esté presente
            getMembershipClass: (membershipEnd) => {
                const endDate = new Date(membershipEnd);
                const now = new Date();
                const oneWeekFromNow = new Date();
                oneWeekFromNow.setDate(now.getDate() + 7);

                if (endDate < now) {
                    return 'expired';
                } else if (endDate < oneWeekFromNow) {
                    return 'expiring-soon';
                } else {
                    return 'active';
                }
            }
        });
    } catch (err) {
        console.error('Error fetching data for dashboard:', err);
        res.status(500).send('Server Error');
    }
});










app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
