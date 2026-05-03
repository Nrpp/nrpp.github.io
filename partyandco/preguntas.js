// NOTE: "correcta" uses 1-based indexing (1 = first option).
// Managed by Beat Battle Admin Panel.
// Last updated: 2026-05-03T20:26:12.343Z

const preguntas = {
    dibujar: [
        "Draw a piano",
        "Draw Chopin",
        "Draw a music score / sheet music",
        "Draw a violin",
        "Draw a music note",
        "Draw a conductor with a baton"
    ],
    mimica: [
        "Playing a lute",
        "Singing Gregorian chant in a monastery",
        "A knight dancing at a medieval party",
        "Ringing church bells",
        "Writing music by hand on parchment",
        "A group singing in a cathedral",
        "Playing a harp in the Middle Ages",
        "Dancing a Renaissance court dance",
        "Painting while music is playing",
        "Playing a recorder",
        "A king watching musicians perform",
        "Singing in a choir with many voices",
        "Playing a violin in a palace",
        "Conducting a small orchestra",
        "Playing the harpsichord",
        "A composer writing a symphony",
        "Bowing after a performance",
        "A fancy ball with classical music",
        "Playing a flute solo",
        "Listening carefully to a concert",
        "A dramatic opera scene",
        "A singer hitting a very high note",
        "Playing the piano with emotion",
        "A romantic couple dancing slowly",
        "A composer feeling inspired",
        "Clapping after a concert",
        "A musician practicing for hours",
        "Playing music very loudly (forte)",
        "Playing music very softly (piano)",
        "An orchestra playing together"
    ],
    definicion: [
        "What is a nocturne?",
        "Define Romantic music",
        "What is a music score?",
        "What is counterpoint?",
        "Define polyphony",
        "What is a cadenza?"
    ],
    test: [
        {
            pregunta: "During the Renaissance, which intellectual movement shifted the focus of the Universe from God to humans?",
            opciones: ["Modernism","Humanism","Theocentrism","Scholasticism"],
            correcta: 2
        },
        {
            pregunta: "In the context of Renaissance voice organization, which voice is traditionally responsible for singing the original Gregorian melody?",
            opciones: ["Soprano (superius)","Contratenor (altus)","Tenor","Bass (bassus)"],
            correcta: 3
        },
        {
            pregunta: "What is the primary difference between homophony and counterpoint in Renaissance music?",
            opciones: ["The number of voices used","Rhythmic independence of the melodies","The inclusion of instrumental accompaniment","The use of Latin vs. secular languages"],
            correcta: 2
        },
        {
            pregunta: "Which Spanish secular genre was known for being a joyful expression of everyday village life and non-religious topics?",
            opciones: ["Motet","Villancico","Madrigal","Chanson"],
            correcta: 2
        },
        {
            pregunta: "If note LA has a frequency of 440 Hz, what would be the frequency of the note one octave higher?",
            opciones: ["441 Hz","880 Hz","660 Hz","220 Hz"],
            correcta: 2
        },
        {
            pregunta: "Which sound quality is directly determined by the amplitude of sound waves and is measured in decibels (dB)?",
            opciones: ["Duration","Pitch","Timbre","Intensity"],
            correcta: 4
        },
        {
            pregunta: "What are 'harmonics' in the context of musical timbre?",
            opciones: ["The speed at which sound travels through a dense medium","A technique used to change volume gradually","The main melody sung by the soprano","Additional vibrations that are integer multiples of the fundamental frequency"],
            correcta: 4
        },
        {
            pregunta: "Which instrument was considered the most important string instrument of the Renaissance?",
            opciones: ["Lute","Viola","Rebec","Sackbut"],
            correcta: 1
        },
        {
            pregunta: "In Spanish Renaissance music, what were 'musical chapels' used for?",
            opciones: ["Groups of musicians working together to create religious music","Places where only secular villancicos were performed","Factories used for the early mass production of printing presses","Schools dedicated exclusively to teaching the rebec"],
            correcta: 1
        },
        {
            pregunta: "True or False: During the Renaissance, instrumental music was primarily used as a simple accompaniment to the voice and did not exist as an independent genre.",
            opciones: ["True","False"],
            correcta: 2
        },
        {
            pregunta: "According to the artistic-musical timeline provided, which period immediately follows the Middle Ages (400-1400)?",
            opciones: ["Romanticism","Classicism","Renaissance","Baroque"],
            correcta: 3
        },
        {
            pregunta: "What is the primary reason Latin was used for the lyrics of Gregorian Chant?",
            opciones: ["It was the only language with a developed system of musical notation.","It was easier for the 'schola cantorum' to memorize than their native tongues.","It allowed the music to be understood and used consistently across the Christian Church.","It was the language primarily spoken by the noble troubadours in town squares."],
            correcta: 3
        },
        {
            pregunta: "Which term describes a style of Gregorian Chant where two to four notes are sung for every single syllable of text?",
            opciones: ["Monody","Melismatic","Syllabic","Neumatic"],
            correcta: 4
        },
        {
            pregunta: "In the early development of polyphony, what was the function of the 'vox organalis'?",
            opciones: ["It was a rhythmic accompaniment played by a portable organ.","It was the lead voice sung only by the Pope during papal services.","It was a second voice added to the chant that often moved in parallel to the main melody.","It was the original Gregorian melody used as the foundation of the piece."],
            correcta: 3
        },
        {
            pregunta: "Which set of composers is associated with the $12$th-century polyphonic innovations at the Notre Dame Cathedral in Paris?",
            opciones: ["Léonin and Pérotin","Beatriz de Día and King Alfonso X","Bernart de Ventadorn and Jaufré Rudel","Alfonso X and Gregory I"],
            correcta: 1
        },
        {
            pregunta: "How did the social status of troubadours typically differ from that of jongleurs?",
            opciones: ["Troubadours performed in churches, while jongleurs performed in noble houses.","Troubadours were of noble birth, while jongleurs were usually of humble origin.","Jongleurs wrote the music, while troubadours only performed it.","There was no difference; both terms referred to the same group of traveling musicians."],
            correcta: 2
        },
        {
            pregunta: "The 'Cántigas de Santa María' are unique in medieval religious music because they:",
            opciones: ["Were written entirely in Latin to approach God through reflection.","Prohibited the use of any instruments during performance.","Were composed exclusively by monks within the Notre Dame Cathedral.","Involved both vocal and instrumental music in honor of the Virgin Mary."],
            correcta: 4
        },
        {
            pregunta: "Which musical texture is defined by multiple independent melodies of similar importance playing simultaneously?",
            opciones: ["Melody with accompaniment","Monophonic","Homophonic","Polyphonic"],
            correcta: 4
        },
        {
            pregunta: "Which of these instruments was commonly used in medieval secular music and is an ancestor of the modern guitar or violin?",
            opciones: ["Piano","Lute (oud)","Clarinet","Trumpet"],
            correcta: 2
        },
        {
            pregunta: "In the context of musical texture, how is 'homophonic' music perceived by the listener?",
            opciones: ["As a single, thin line of sound without any depth.","As a succession of chords where the highest melody is often the main one.","As a chaotic mix of voices where no single rhythm can be found.","As a solo instrument playing with a quiet drum accompaniment."],
            correcta: 2
        },
        {
            pregunta: "What is the recognized timeframe for the Classical period in music history according to the source material?",
            opciones: ["1700-1780","1820-1900","1600-1750","1750-1820"],
            correcta: 4
        },
        {
            pregunta: "Which musical texture became increasingly important during the Classical period, especially to ensure vocal clarity?",
            opciones: ["Monophony","Accompanied melody","Complex Polyphony","Heterophony"],
            correcta: 2
        },
        {
            pregunta: "Classical composers expanded the use of dynamics to express a wider range of emotions. Which of the following notations represents the softest level mentioned?",
            opciones: ["mf","mp","p","pp"],
            correcta: 4
        },
        {
            pregunta: "What distinguishes German Singspiel from traditional Italian Opera Seria?",
            opciones: ["It is exclusively performed by vocal virtuosos.","It combines spoken dialogue with music.","It deals only with historical and mythological themes.","It was created specifically for the upper classes."],
            correcta: 2
        },
        {
            pregunta: "Which Spanish musical genre was divided into 'grande' and 'chica' types during its Classical period revival?",
            opciones: ["Zarzuela","Tonadilla escénica","Opera Buffa","Flamenco"],
            correcta: 1
        },
        {
            pregunta: "In the context of chamber music, which ensemble is considered the most typical for the Classical period?",
            opciones: ["Piano Trio","Woodwind Quintet","String Quartet","Brass Quintet"],
            correcta: 3
        },
        {
            pregunta: "Which instrument was invented by Bartolomeo Cristofori in 1698 and became dominant due to its ability to produce varying volumes?",
            opciones: ["Pipe Organ","Pianoforte","Clavichord","Harpsichord"],
            correcta: 2
        },
        {
            pregunta: "Joseph Haydn is frequently referred to by which of the following titles?",
            opciones: ["The Father of the Symphony","The Architect of the Opera","The Master of the Fugue","The Creator of the Pianoforte"],
            correcta: 1
        },
        {
            pregunta: "What is the term for a harmonic arrival point at the end of a musical phrase, similar to a period in a sentence?",
            opciones: ["Subphrase","Cadence","Period","Motif"],
            correcta: 2
        },
        {
            pregunta: "A conclusive cadence that uses the IV (subdominant) and I (tonic) degrees is known as a/an:",
            opciones: ["Deceptive cadence","Authentic cadence","Plagal cadence","Half cadence"],
            correcta: 3
        },
        {
            pregunta: "What occurs in a 'deceptive cadence' to create its characteristic suspended effect?",
            opciones: ["It resolves directly to the I (tonic) degree from the dominant.","It consists solely of the IV (subdominant) degree.","The progression moves from the V (dominant) to the VI (submediant).","The melody ends abruptly on the tonic degree."],
            correcta: 3
        },
        {
            pregunta: "How is a 'symmetrical period' defined in Classical musical structure?",
            opciones: ["It uses an unequal number of bars in its component sections.","It consists of a single phrase that repeats exactly.","It is subdivided into sections with an equal number of bars.","It ends with an inconclusive cadence in both phrases."],
            correcta: 3
        },
        {
            pregunta: "Which Romantic characteristic describes composers using elements from their country's folk traditions to express a cultural identity?",
            opciones: ["Creative Individualism","Nationalism","Programmatic music","Virtuosity"],
            correcta: 2
        },
        {
            pregunta: "Which of the following works is cited as a famous example of programmatic music in the Romantic period?",
            opciones: ["Nocturne in E flat by Frédéric Chopin","Symphonie Fantastique by Hector Berlioz","La verbena de la paloma by Tomás Bretón","The Ring of the Nibelung by Richard Wagner"],
            correcta: 2
        },
        {
            pregunta: "Which smaller musical form is described as a lively Polish folk dance in 3/4 time with a strong accent on the second beat?",
            opciones: ["Nocturne","Etude","Waltz","Mazurka"],
            correcta: 4
        },
        {
            pregunta: "In the context of German Romantic Opera, what is a 'Leitmotiv'?",
            opciones: ["A group of songs that share a common theme","A musical theme used to represent characters or ideas","A short, one-act theatrical performance with music","A style of highly decorated and expressive singing"],
            correcta: 2
        },
        {
            pregunta: "What distinguishes the Spanish 'Zarzuela' from other vocal genres described in the material?",
            opciones: ["It focuses exclusively on medieval myths and German legends.","It completely removes the distinction between arias and recitatives.","It consists of one voice accompanied only by an expressive piano.","It uses street slang and regional folklore to depict daily life."],
            correcta: 4
        },
        {
            pregunta: "The 'Lied' genre is typically defined as vocal chamber music that combines music with:",
            opciones: ["Street slang and dialects","Orchestral ballet","Poetry","Virtuosic violin solos"],
            correcta: 3
        },
        {
            pregunta: "Which composer is specifically noted for mixing classical structure with Romantic emotion in his symphonies and concertos?",
            opciones: ["Frédéric Chopin","Richard Wagner","Johannes Brahms","Franz Schubert"],
            correcta: 3
        },
        {
            pregunta: "According to the tonal system, what is the 'tonic'?",
            opciones: ["The main note of a scale that sets the key","The set of accidentals placed after the clef","A sign that cancels the effect of a sharp or flat","A scale that contains only five notes"],
            correcta: 1
        },
        {
            pregunta: "What is the interval pattern for a Major Scale (M)?",
            opciones: ["Tone–Semitone–Tone–Tone–Semitone–Tone–Tone","Semitone–Semitone–Semitone–Semitone–Semitone–Semitone","Tone–Tone–Semitone–Tone–Tone–Tone–Semitone","Tone–Tone–Tone–Semitone–Tone–Tone–Semitone"],
            correcta: 3
        },
        {
            pregunta: "Which sign is used to raise a note's pitch by a half tone?",
            opciones: ["The natural (♮)","The flat (♭)","The sharp (♯)","The tonic"],
            correcta: 3
        },
        {
            pregunta: "What is the purpose of a key signature (armadura) in music notation?",
            opciones: ["To define the rhythm and time signature of the work","To avoid writing accidentals repeatedly throughout the piece","To indicate the speed at which the music should be played","To list all twelve notes of the chromatic scale"],
            correcta: 2
        },
        {
            pregunta: "According to the provided material, what is the correct order of sharps in a key signature?",
            opciones: ["SI-MI-LA-RE-SOL-DO-FA","SOL-RE-LA-MI-SI-FA-DO","DO-RE-MI-FA-SOL-LA-SI","FA-DO-SOL-RE-LA-MI-SI"],
            correcta: 4
        },
        {
            pregunta: "Which scale is characterized by having only 5 notes and appearing in many different cultures?",
            opciones: ["Pentatonic scale","Chromatic scale","Minor scale","Major scale"],
            correcta: 1
        },
        {
            pregunta: "Who is noted as a Russian composer famous for ballets like 'Swan Lake' and 'The Nutcracker'?",
            opciones: ["Frédéric Chopin","Pyotr Ilyich Tchaikovsky","Niccolò Paganini","Franz Schubert"],
            correcta: 2
        },
        {
            pregunta: "What are the commonly accepted dates for the Baroque period in music history?",
            opciones: ["1750–1820","1600–1750","1650–1800","1450–1600"],
            correcta: 2
        },
        {
            pregunta: "In the Baroque concept of 'hierarchy of voices,' which voice typically carries the main melody?",
            opciones: ["All voices equally (polyphony)","The bass voice","The inner voices (alto and tenor)","The soprano or upper voice"],
            correcta: 4
        },
        {
            pregunta: "Which musical element consists of a written bass line and indications for chords, allowing musicians to improvise harmony?",
            opciones: ["Ostinato Bass","Basso Continuo","Aria","Counterpoint"],
            correcta: 2
        },
        {
            pregunta: "Who were the 'stars of the stage' during the Baroque period, known for their powerful high voices and amazing technique?",
            opciones: ["Falsettists","Tenors","Sopranos","Castrati"],
            correcta: 4
        },
        {
            pregunta: "Where did Opera emerge around the year 1600?",
            opciones: ["Vienna, Austria","London, England","Florence, Italy","Paris, France"],
            correcta: 3
        },
        {
            pregunta: "In an opera, which part is a declamatory style of singing intended to advance the narrative or action?",
            opciones: ["Recitative","Aria","Overture","Chorus"],
            correcta: 1
        },
        {
            pregunta: "Which Baroque vocal form is similar to opera in its use of soloists and choir but typically addresses religious themes and lacks staging?",
            opciones: ["Oratorio","The Passion","Cantata","Suite"],
            correcta: 1
        },
        {
            pregunta: "What is the primary difference between the 'concertino' and the 'ripieno' in a Concerto Grosso?",
            opciones: ["The concertino is a small group of soloists, while the ripieno is the full orchestra.","The concertino consists of woodwinds and the ripieno consists of strings.","The concertino is the choir and the ripieno is the orchestra.","The concertino plays the melody and the ripieno plays only the basso continuo."],
            correcta: 1
        },
        {
            pregunta: "Which keyboard instrument creates sound by using quills to pluck strings?",
            opciones: ["Organ","Harpsichord","Clavichord","Piano"],
            correcta: 2
        },
        {
            pregunta: "According to the source material, what are 'harmonic intervals'?",
            opciones: ["Intervals that always sound relaxed.","Intervals that move only in an ascending direction.","Notes that are heard one after another.","Notes that are heard simultaneously."],
            correcta: 4
        },
        {
            pregunta: "Which of the following describes a 'dissonant' interval?",
            opciones: ["Any interval consisting of more than three tones.","An interval perceived as relaxed, such as an octave.","An interval perceived as tense, such as a major second.","A perfect fifth."],
            correcta: 3
        },
        {
            pregunta: "How is a major triad constructed in the Western tonal system?",
            opciones: ["A major third and a perfect fifth added to the root note.","A minor third and a perfect fifth added to the root note.","Three notes played successively one after another.","A major second and a minor seventh."],
            correcta: 1
        }
    ]
};
