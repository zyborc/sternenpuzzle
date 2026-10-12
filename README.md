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

- 6 eigene Chibi-/Kawaii-Weltraumillustrationen, jeweils 1200 × 1200 Pixel.
- 4, 9, 16 oder 25 Teile mit echten Puzzlekonturen.
- Puzzleteil auf seinen Platz ziehen oder erst ein Teil und dann den Platz antippen.
- Mit Tab und Enter/Leertaste bedienen; nach Auswahl per Tastatur springt der Fokus zum Brett.
- Im Brett mit Pfeiltasten wechseln und mit Enter/Leertaste einsetzen.
- Bildhilfe lässt sich ein- und ausschalten.
- Die Vorschau zeigt das ganze Bild und pausiert die Uhr.
- Ein Tipp markiert das ausgewählte Teil und seinen Platz.
- Kein Zeitlimit und keine Strafpunkte.
- Je ein Sammelstern pro Motiv und Teilezahl (maximal 24).
- Ton ist anfangs ausgeschaltet und lässt sich optional aktivieren.
- Reduzierte Animationen bei entsprechender Betriebssystemeinstellung.

## Fortschritt und Datenschutz

Die App lädt nur ihre eigenen Dateien, verwendet keine Werbung und kein Tracking.
Der aktuelle Spielstand, Sterne, Ton-Einstellung und bevorzugte Teilezahl werden
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
- `artwork_data.json`, `html_template.txt`: Quelldaten der Illustrationen und der früheren Einzeldatei-Version.
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
