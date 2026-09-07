# TIMSS 2023 – Matematika ME2

Cvičný online test s 11 uvolněnými úlohami podle dodané předlohy MAT_Test1_ME2.pdf. Maximum je 12 bodů. Slovní hodnocení je motivační stupnice této aplikace, nikoli oficiální stupnice TIMSS.

## Zveřejnění na GitHub Pages

1. Otevřete repozitář `klementlibor-uhk/timss2023-uvolnene-01`.
2. Zvolte **Add file → Upload files**.
3. Nahrajte obsah rozbaleného balíčku: soubory `index.html`, `style.css`, `app.js`, `scoring.js`, `README.md` a celou složku `assets`. Soubor `index.html` musí být v kořeni repozitáře, nikoli v další podsložce. Nenahrávejte samotný ZIP.
4. Dole klikněte na **Commit changes**.
5. Otevřete **Settings → Pages**. U Source vyberte **Deploy from a branch**, větev **main**, složku **/(root)** a **Save**.
6. Po dokončení publikování bude test na https://klementlibor-uhk.github.io/timss2023-uvolnene-01/ . Stav publikování najdete také na kartě Actions.

## Použití

Test lze spustit i otevřením `index.html` z rozbalené složky. Nepotřebuje instalaci ani sestavení. Při přecházení šipkami se odpovědi zachovají. Obnovení nebo zavření stránky pokus vymaže. Časomíra nemá časový limit. Výsledky se nikam neodesílají.

U šneků přetáhněte S a T na požadované body. Alternativně vyberte písmeno a klikněte na bod; podporována je také klávesnice (Tab a Enter). Přesun se vyhodnotí až při odevzdání.

Před odevzdáním se zobrazí potvrzení a počet nedokončených úloh. Poté se zobrazí body, procenta, slovní hodnocení a možnost prohlédnout odpovědi, vytisknout výsledek nebo začít nový pokus. Výsledek ani správné odpovědi nelze v režimu prohlížení měnit.

Číselné odpovědi podporují desetinnou čárku a tečku, mezery v tisících a zlomky včetně smíšeného zápisu `1 1/4`.

## Bodování

Úlohy 1–10: každá nejvýše 1 bod. ME61256 se hodnotí podle volby Ano/Ne, textové vysvětlení nemá vliv na skóre a je dostupné při prohlížení dokončeného pokusu. U úhlů musí být správně všechny čtyři hodnocené řádky, u šneků obě značky. Poslední úloha ME61211 má dva samostatně hodnocené podúkoly za 1 bod.

11–12 bodů: Výborně!; 9–10: Velmi dobře!; 6–8: Dobře!; 3–5: Ještě trochu procvičování a půjde to lépe.; 0–2: Nevzdávej to, zkus úlohy znovu.

## Podklady

Texty a výřezy diagramů pocházejí z uživatelem dodaného dokumentu s uvolněnými úlohami TIMSS 2023 (IEA). Aplikace rekonstruuje jeho rozhraní s živými formuláři a přidává vyhodnocení. Nejde o původní testovací software TIMSS. Správné odpovědi jsou součástí klientského JavaScriptu, proto je aplikace určena k procvičování.
