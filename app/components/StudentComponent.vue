<template>
<div class="rounded max-w-4xl mx-auto p-8 font-sans leading-relaxed text-gray-800 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
    <h1 class="text-4xl font-bold text-center text-gray-900 mb-8 pb-4 border-b-4 border-blue-500 shadow-lg">Příručka pro studenta</h1>
    <h2 class="text-2xl font-semibold text-gray-800 mt-8 mb-4 pl-4 border-l-4 border-red-500 bg-red-50 py-2 px-4 rounded-r-lg">Vstup do systému</h2>
    <p class="mb-4 p-4 bg-white rounded-lg shadow-md text-justify">Do systému lze vstoupit v kolonce <code class="bg-gray-100 px-2 py-1 rounded text-red-600 font-mono border">Systém</code></p>
    <h2 class="text-2xl font-semibold text-gray-800 mt-8 mb-4 pl-4 border-l-4 border-yellow-500 bg-yellow-50 py-2 px-4 rounded-r-lg">Nastavení jazyka a zobrazení klávesových zkratek</h2>
    <p class="mb-4 p-4 bg-white rounded-lg shadow-md text-justify">Do nastavení lze vstoupit v kolonce <code class="bg-gray-100 px-2 py-1 rounded text-red-600 font-mono border">Nastavení</code></p>
    <h2 class="text-2xl font-semibold text-gray-800 mt-8 mb-4 pl-4 border-l-4 border-green-500 bg-green-50 py-2 px-4 rounded-r-lg">Stránky systému</h2>
    <h3 class="text-xl font-medium text-blue-700 mt-6 mb-2 pl-2 border-l-4 border-gray-400">Nástěnka</h3>
    <p class="mb-4 p-4 bg-white rounded-lg shadow-md text-justify">Nástěnka zobrazuje přehled všech důležitých informací a statistik.</p>
    <h3 class="text-xl font-medium text-blue-700 mt-6 mb-2 pl-2 border-l-4 border-gray-400">Turnusy</h3>
    <p class="mb-4 p-4 bg-white rounded-lg shadow-md text-justify">Na stránce <code class="bg-gray-100 px-2 py-1 rounded text-red-600 font-mono border">Turnusy</code> lze vidět přehled všech turnusů, do kterých je přiřadit vedoucí a účastníky. Můžete je zde vytvářet a upravovat.</p>
    <h3 class="text-xl font-medium text-blue-700 mt-6 mb-2 pl-2 border-l-4 border-gray-400">Účastníci</h3>
    <p class="mb-4 p-4 bg-white rounded-lg shadow-md text-justify">Na stránce <code class="bg-gray-100 px-2 py-1 rounded text-red-600 font-mono border">Účastníci</code> lze vidět přehled všech účastníků, kteří jsou přiřazeni k jednotlivým turnusům. Můžete je zde vytvářet a upravovat.</p>
    <h3 class="text-xl font-medium text-blue-700 mt-6 mb-2 pl-2 border-l-4 border-gray-400">Vedoucí</h3>
    <p class="mb-4 p-4 bg-white rounded-lg shadow-md text-justify">Na stránce <code class="bg-gray-100 px-2 py-1 rounded text-red-600 font-mono border">Vedoucí</code> lze vidět přehled všech vedoucích, kteří jsou přiřazeni k jednotlivým turnusům. Můžete je zde vytvářet a upravovat.</p>
    <h3 class="text-xl font-medium text-blue-700 mt-6 mb-2 pl-2 border-l-4 border-gray-400">Jídla</h3>
    <p class="mb-4 p-4 bg-white rounded-lg shadow-md text-justify">Na stránce <code class="bg-gray-100 px-2 py-1 rounded text-red-600 font-mono border">Jídla</code> lze vidět přehled všech jídel, která jsou naplánována na jednotlivé dny. Můžete je zde vytvářet a upravovat.</p>
    <h3 class="text-xl font-medium text-blue-700 mt-6 mb-2 pl-2 border-l-4 border-gray-400">Jídelníček</h3>
    <p class="mb-4 p-4 bg-white rounded-lg shadow-md text-justify">Na stránce <code class="bg-gray-100 px-2 py-1 rounded text-red-600 font-mono border">Jídelníček</code> lze vidět přehled všech jídel, která jsou naplánována na jednotlivé dny. Můžete je zde vytvářet a upravovat.</p>
    <h2 class="text-2xl font-semibold text-gray-800 mt-8 mb-4 pl-4 border-l-4 border-purple-500 bg-purple-50 py-2 px-4 rounded-r-lg">Další kolonky</h2>
    <h3 class="text-xl font-medium text-blue-700 mt-6 mb-2 pl-2 border-l-4 border-gray-400">Databáze</h3>
    <p class="mb-4 p-4 bg-white rounded-lg shadow-md text-justify">Na stránce <code class="bg-gray-100 px-2 py-1 rounded text-red-600 font-mono border">Databáze</code> lze vidět přehled všech tabulek v databázi. Můžete zde provádět SQL dotazy. Lze zde obnovit databázi do výchozího stavu.</p>
    <h3 class="text-xl font-medium text-blue-700 mt-6 mb-2 pl-2 border-l-4 border-gray-400">Skóré</h3>
    <p class="mb-4 p-4 bg-white rounded-lg shadow-md text-justify">V kolonce <code class="bg-gray-100 px-2 py-1 rounded text-red-600 font-mono border">Skóré</code> lze vidět vaše aktuální skóré. Za chybnou odpověď získáváte penalizaci a za správnou odpověď získáváte body.</p>
    <h3 class="text-xl font-medium text-blue-700 mt-6 mb-2 pl-2 border-l-4 border-gray-400">Zapnout/Vypnout úpravy</h3>
    <p class="mb-4 p-4 bg-white rounded-lg shadow-md text-justify">V kolonce <code class="bg-gray-100 px-2 py-1 rounded text-red-600 font-mono border">Zapnout/Vypnout úpravy</code> lze zapnout nebo vypnout režim úprav. Tento režim slouží k tomu, abyste mohli upravovat komponenty.</p>
    <h3 class="text-xl font-medium text-blue-700 mt-6 mb-2 pl-2 border-l-4 border-gray-400">Student</h3>
    <p class="mb-4 p-4 bg-white rounded-lg shadow-md text-justify">V kolonce <code class="bg-gray-100 px-2 py-1 rounded text-red-600 font-mono border">Student</code> lze vidět tuto příručku.</p>
    <h3 class="text-xl font-medium text-blue-700 mt-6 mb-2 pl-2 border-l-4 border-gray-400">Nastavení</h3>
    <p class="mb-4 p-4 bg-white rounded-lg shadow-md text-justify">V kolonce <code class="bg-gray-100 px-2 py-1 rounded text-red-600 font-mono border">Nastavení</code> lze změnit jazyk a vidět klávesové zkratky.</p>
    <h3 class="text-xl font-medium text-blue-700 mt-6 mb-2 pl-2 border-l-4 border-gray-400">Obnovit systém</h3>
    <p class="mb-4 p-4 bg-white rounded-lg shadow-md text-justify">V podkolonce <code class="bg-gray-100 px-2 py-1 rounded text-red-600 font-mono border">Obnovit komponenty</code> lze obnovit kód komponent do výchozího stavu. V podkolonce <code class="bg-gray-100 px-2 py-1 rounded text-red-600 font-mono border">Obnovit úkoly</code> lze obnovit skóre a postup v plnění úkolů.</p>
    <h3 class="text-xl font-medium text-blue-700 mt-6 mb-2 pl-2 border-l-4 border-gray-400">Opustit systém</h3>
    <p class="mb-4 p-4 bg-white rounded-lg shadow-md text-justify">V podkolonce <code class="bg-gray-100 px-2 py-1 rounded text-red-600 font-mono border">Odejít a neukládat</code> lze ukončit relaci a vrátit se na stránku se systémy. V podkolonce <code class="bg-gray-100 px-2 py-1 rounded text-red-600 font-mono border">Odejít a uložit výsledek</code> lze ukončit relaci a uložit všechny změny, ale tahle možnost ještě není dostupná. V podkolonce <code class="bg-gray-100 px-2 py-1 rounded text-red-600 font-mono border">Zůstat v systému</code> lze zůstat v aktuální relaci.</p>
    <h3 class="text-xl font-medium text-blue-700 mt-6 mb-2 pl-2 border-l-4 border-gray-400">Úkoly</h3>
    <p class="mb-4 p-4 bg-white rounded-lg shadow-md text-justify">Kolonka je kulaté limetkové tlačítko v dolním pravém rohu. Zde můžete vidět aktuální seznam úkolů, jejich stav a také můžete odevzdávat odpovědi na úkoly.</p>
    <h2 class="text-2xl font-semibold text-gray-800 mt-8 mb-4 pl-4 border-l-4 border-teal-500 bg-teal-50 py-2 px-4 rounded-r-lg">Úprava komponent</h2>
    <p class="mb-4 p-4 bg-white rounded-lg shadow-md text-justify">Klikněte na <code class="bg-gray-100 px-2 py-1 rounded text-red-600 font-mono border">Zapnout úpravy</code> pro povolení režimu úprav. Klikněte na ikonu tužtičky a můžete upravovat</p>
</div>
</template>
