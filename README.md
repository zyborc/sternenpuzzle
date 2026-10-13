# Sternenpuzzle

Eine eigenständige, offline spielbare Puzzle-Anwendung für Kinder.

## Auf iPhone und iPad spielen (Web-App)

Das Spiel wird über GitHub Pages bereitgestellt und lässt sich wie eine App installieren:

1. Die Spiel-Adresse in **Safari** öffnen.
2. Auf „Teilen“ (Quadrat mit Pfeil nach oben) tippen und **„Zum Home-Bildschirm“** wählen.
3. Das Sternenpuzzle über das Raketen-Icon starten: Vollbild, ohne Browserleiste.

Nach dem ersten Öffnen ist alles auf dem Gerät gespeichert (`sw.js`), das Spiel läuft dann auch ohne Internet.
Hinweis: Die installierte App speichert Sterne und Spielstand getrennt von Safari.
Der Ton folgt dem Stummschalter des iPhones.

### Updates veröffentlichen

Nach Änderungen an Dateien in `sw.js` die Konstante `VERSION` erhöhen (z. B. `sternenpuzzle-v2`),
committen und pushen. Die Geräte laden die neue Version beim nächsten Start mit Internet
und nutzen sie ab dem darauffolgenden Start.

## Lokal starten

`index.html` direkt im Browser öffnen (Offline-Cache und Installation funktionieren nur über http/https),
oder im Ordner `python -m http.server 8765` ausführen und `http://localhost:8765/` öffnen.

## Spielen

- Drei Welten mit je 6 eigenen Chibi-/Kawaii-Illustrationen (1200 × 1200 Pixel): Weltraum, Dinos und Rettungs-Hunde.
- Die Welt wird oben auf der Startseite gewählt; Sterne werden pro Welt angezeigt.
- 4, 9, 16 oder 25 Teile mit echten Puzzlekonturen.
- Puzzleteil auf seinen Platz ziehen oder erst ein Teil und dann den Platz antippen.
- Mit Tab und Enter/Leertaste bedienen; nach Auswahl per Tastatur springt der Fokus zum Brett.
- Im Brett mit Pfeiltasten wechseln und mit Enter/Leertaste einsetzen.
- Zeichen im Puzzle zum Lernen: Zahlen, Großbuchstaben (A–Y), Würfelpunkte (bis 9 Teile) oder ohne.
  Optional stehen die Zeichen auch auf den Teilen. Bei eingeschaltetem Ton werden sie vorgelesen
  („Ka wie Katze“), auch beim Antippen eines freien Platzes.
- Bildhilfe lässt sich ein- und ausschalten.
- Die Vorschau zeigt das ganze Bild und pausiert die Uhr.
- Ein Tipp markiert das ausgewählte Teil und seinen Platz.
- Kein Zeitlimit und keine Strafpunkte.
- Je ein Sammelstern pro Motiv und Teilezahl (maximal 72).
- Ton ist anfangs ausgeschaltet und lässt sich optional aktivieren.
- Reduzierte Animationen bei entsprechender Betriebssystemeinstellung.

## Fortschritt und Datenschutz

Die App lädt nur ihre eigenen Dateien, verwendet keine Werbung und kein Tracking.
Der aktuelle Spielstand, Sterne, Ton-Einstellung, gewählte Welt und bevorzugte Teilezahl werden
nach Möglichkeit ausschließlich im Browser unter localStorage gespeichert.
Es wird jeweils eine nicht abgeschlossene Runde zum Fortsetzen gespeichert.
Werden Browserspeicher oder Browserprofil gelöscht/gewechselt, geht der gespeicherte Fortschritt verloren.
Wenn der Browser lokale Speicherung für HTML-Dateien blockiert, bleibt der Fortschritt nur in der geöffneten Sitzung erhalten.

## Quellcode-Paket

- `index.html`: Spielseite mit separaten lokalen Ressourcen.
- `app.js`: Spiellogik, Pointer-Bedienung, Hilfen, lokales Speichern, Web-App-Einrichtung.
- `style.css`: responsive Oberfläche, iPhone/iPad-Anpassungen und reduziertes Animationsprofil.
- `manifest.webmanifest`, `sw.js`, `icons/`: Installation als Home-Bildschirm-App und Offline-Cache.
- `bilder/`: alle Motive als PNG und als skalierbares SVG.
- `artwork_data.json`, `html_template.txt`: Quelldaten der Weltraum-Illustrationen und der früheren Einzeldatei-Version.
- `werkzeuge/kunst/`: Zeichenwerkzeug für neue Motive (siehe unten).
- `medien/start.mp4`, `medien/start-poster.jpg`: Startseiten-Video (12 s Loop, H.264) und Standbild.
- `werkzeuge/video/`: erzeugt das Startseiten-Video aus den Motiven.

## Neue Motive oder Welten hinzufügen

1. Einmalig in `werkzeuge/kunst` `npm install` ausführen.
2. Ein Motiv ist eine Datei `werkzeuge/kunst/motive/<nr>_<name>.mjs`: Sie exportiert `meta`
   (`slug`, `theme`, `title`, `description`, `alt`) und eine Funktion, die das SVG liefert.
   Die gemeinsamen Stil-Helfer stehen in `stil.mjs`, figurenspezifische Helfer in `dinos.mjs` bzw. `hunde.mjs`.
3. `node rendern.mjs motive/<datei>.mjs` erzeugt `bilder/<slug>.svg` und `.png`.
4. `node motive-eintragen.mjs` trägt alle Motive in `index.html` (ASSETS) und `sw.js` ein.
5. Eine neue Welt zusätzlich in `THEMES` in `index.html` anlegen.
6. In `sw.js` `VERSION` erhöhen, committen und pushen.

## Startseiten-Video neu erzeugen

In `werkzeuge/video` einmalig `npm install`, dann `node start-video.mjs` (ffmpeg muss installiert sein).
Welche Bilder vorkommen, steht oben im Skript (`WORLDS`). Danach in `sw.js` `VERSION` erhöhen.
Das Video spielt nur auf der Startseite, stumm, und bleibt bei „Bewegung reduzieren“ als Standbild stehen.

## Teaser-Video zum Teilen

`medien/teaser-hochformat.mp4` (1080 × 1920, für Status/Story/Reels) und `medien/teaser-quadrat.mp4` (1080 × 1080):
18 Sekunden Motion Graphics mit selbst komponiertem Glockenspiel-Jingle. Neu erzeugen mit `node teaser.mjs` in `werkzeuge/video`.
Bild und Ton hängen am selben Taktplan (`CUES` in `teaser.mjs`, Synthesizer in `musik.mjs`); Figuren kommen aus `werkzeuge/kunst` (`figuren.mjs`).
Schrift: Fredoka (SIL Open Font License, `werkzeuge/video/schrift/OFL.txt`).

Neue Motive immer hinten anhängen: Ein gespeicherter Spielstand merkt sich die Position des Motivs.
Keine geschützten Figuren (z. B. aus Serien) zeichnen – das Spiel ist öffentlich erreichbar.
Alle Motive wurden eigens als Illustrationen gezeichnet; es sind keine Fotos.

## Prüfung

- JavaScript-Syntax in einer echten JavaScript-Engine geprüft.
- 270 Pfadfälle über vier Rastergrößen und fünf Zufallsstarts geprüft.
- Kantenpassung, Mischen, Zeitformat und Bereinigung lokaler Speicherdaten geprüft.
- Alle sechs Motive mit simuliertem DOM und tatsächlichem Canvas durchgespielt.
- Richtige/falsche Platzierung, Tipps, Drag & Drop, Fortsetzen, Uhrpause, Sterne und Abschluss geprüft.
- PNG-Einbettung, Abmessungen, eindeutige HTML-IDs und fehlende externe Abhängigkeiten geprüft.
- Zusammensetzen der echten PNG-Konturen für 4/9/16/25 Teile auf Canvas geprüft: keine unbedeckten Pixel.
- Kein vollständiger visueller Browser- oder Geräte-Test in dieser Umgebung möglich.
