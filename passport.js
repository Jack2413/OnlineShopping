module.exports = function(passport, GoogleStrategy, app, fs, cookieSession) {
        
        // cookieSession config
        app.use(cookieSession({
                maxAge: 24 * 60 * 60 * 1000, // one day in milliseconds
                keys: ['passport-test-app']
        }));
        
        app.use(passport.initialize());
        app.use(passport.session());
        
        // Strategy config
        passport.use(new GoogleStrategy({
                        clientID: [
                                '14808020967-asmpn1e4io81vpun1dp47nsi9dfdu22e.',
                                'apps.googleusercontent.com'
                        ],
                        clientSecret: 'B2-onmTEty2T9au3Z2VEoyaO',
                        callbackURL: 'https://nwen304onlineshoping.herokuapp.com/oauthCallback/'
                },
                (accessToken, refreshToken, profile, done) => {
                        done(null, profile); // passes the profile data to 
                }                            // serializeUser
        ));
        
        passport.serializeUser((user, done) => {
                done(null, user);
        });
        passport.deserializeUser((obj, done) => {
                done(null, obj);
        });
        
        passport.use(new GoogleStrategy({
                clientID: [ 
                        '14808020967-asmpn1e4io81vpun1dp47nsi9dfdu22e.',
                        'apps.googleusercontent.com'
                ],
                clientSecret: 'B2-onmTEty2T9au3Z2VEoyaO',
                callbackURL: 'https://nwen304onlineshoping.herokuapp.com/oauthCallback/',
                passReqToCallback: true
                },
                (request, accessToken, refreshToken, profile, done) => {
                        process.nextTick(() => {
                                return done(null, profile);
                        });
                }
        ));
        
        // Middleware to check if the user is authenticated
        function isUserAuthenticated(req, res, next) {
                if (req.user) {
                        next();
                } else {
                        res.redirect('/');
                }
        }
        
        // Routes
        // Login page
        app.get('/', (req, res) => {
                fs.readFile('./front-end/login.html', (err, html) => {
                        if (err) {
                                throw err;
                        }
                        res.writeHeader(200, {"Content-Type": "text/html"});
                        res.write(html);
                        res.end();
                });
        });
        
        // authenticate request
        app.get('https://nwen304onlineshoping.herokuapp.com/loginWithGoogle', passport.authenticate('google', {
                scope: ['profile'] // specify required data
        }));
        
        // receive data from google -> run function on Strategy config
        app.get(
                '/oauthCallback', 
                passport.authenticate('google'), 
                (req, res) => {
                        res.redirect('/details');
                }
        );
        
        // Secret route
        app.get('/details', isUserAuthenticated, (req, res) => {
                res.send(
                        '<p>Welcome ' + req.user.displayName + 
                        '</p> <br/> <a href="/logout">Logout</a>' +
                        '<br/> <a href="/home">Home</a>'
                );
        });
        
        // Handle logout 
        app.get('/logout', (req, res) => {
                req.logout();
                res.redirect('/home');
        });
        
        // Return home
        app.get('/home', (req, res) => {
                fs.readFile('./front-end/index.html', (err, html) => {
                        if (err) {
                                throw err;
                        }
                        res.writeHeader(200, {"Content-Type": "text/html"});
                        res.write(html);
                        res.end();
                });
        });
};