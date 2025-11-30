# 🔧 Rozwiązywanie problemów ze zdjęciami na GitHub Pages

## Problem: Zdjęcia nie ładują się na GitHub Pages

### Szybkie rozwiązanie:

1. **Sprawdź nazwy plików** (otwórz folder images):
   - Czy są małymi literami? ✅ `automat1.jpeg` ❌ `Automat1.JPEG`
   - Czy rozszerzenia są poprawne? ✅ `.jpeg` lub `.jpg` lub `.png`

2. **Sprawdź w konsoli przeglądarki** (F12):
   - Otwórz stronę na GitHub Pages
   - Naciśnij F12 → zakładka Console
   - Szukaj błędów 404 (Not Found)
   - Sprawdź dokładną ścieżkę, której szuka przeglądarka

3. **Poczekaj 2-3 minuty** po wrzuceniu zmian na GitHub

4. **Wymuś odświeżenie** (Ctrl+Shift+R lub Cmd+Shift+R)

### Jeśli nadal nie działa:

**Opcja A: Zmień nazwy plików na małe litery**
```bash
# W folderze images zmień nazwy na:
automat1.jpeg
automat2.jpeg
automat3.jpeg
logo.png
```

**Opcja B: Sprawdź czy folder images został wrzucony**
- Na GitHub wejdź w swoje repo
- Sprawdź czy widzisz folder `images/`
- Sprawdź czy w środku są 4 pliki

**Opcja C: Dodaj plik .nojekyll**
- Plik `.nojekyll` już jest w folderze
- Upewnij się, że został wrzucony na GitHub (może być niewidoczny)

### Testowanie lokalnie vs GitHub Pages:

**Lokalnie (działa):**
- Windows nie rozróżnia wielkości liter
- `Images/Logo.PNG` = `images/logo.png`

**GitHub Pages (nie działa):**
- Linux rozróżnia wielkości liter
- `Images/Logo.PNG` ≠ `images/logo.png`

### Jak sprawdzić dokładną nazwę pliku:

**Windows:**
1. Otwórz folder images
2. Kliknij prawym na plik → Właściwości
3. Sprawdź dokładną nazwę

**GitHub:**
1. Wejdź w repo → folder images
2. Sprawdź nazwy plików (są case-sensitive)

### Link do testowania:

Jeśli Twoje repo to: `https://github.com/username/padibox`
To strona będzie: `https://username.github.io/padibox/`
A zdjęcia: `https://username.github.io/padibox/images/logo.png`

Otwórz bezpośredni link do zdjęcia w przeglądarce - jeśli nie działa, problem jest z nazwą lub ścieżką.
