using System;
using System.Collections.Generic;
using UnityEngine;

namespace LifeGame.Data
{
    [Serializable]
    public class CountryData
    {
        public string countryId;
        public string countryName;
        public string continent;
        public double population;            // e.g., 1,428,000,000
        public float populationSharePercent; // e.g., 17.8%
        public float gdpPerCapitaUSD;        // e.g., 2,600 or 33,000
        public float lifeExpectancyYears;    // e.g., 70.8
        public float infantMortalityPer1000; // e.g., 28.0
        public float healthcareIndex;        // 0 to 100
        public float educationIndex;         // 0 to 100
        public float safetyIndex;            // 0 to 100
        public string currencyCode;          // e.g., "KRW", "USD", "INR"
        public string currencySymbol;        // e.g., "₩", "$", "₹"
        public string flagEmoji;             // e.g., "🇰🇷"
        public string description;
        public List<string> endemicRisks;    // endemic hazards (e.g. malaria, conflict, high stress)

        public CountryData(string id, string name, string continent, double pop, float share, 
            float gdp, float lifeExp, float infantMort, float health, float edu, float safety, 
            string currCode, string currSym, string flag, string desc, List<string> risks)
        {
            this.countryId = id;
            this.countryName = name;
            this.continent = continent;
            this.population = pop;
            this.populationSharePercent = share;
            this.gdpPerCapitaUSD = gdp;
            this.lifeExpectancyYears = lifeExp;
            this.infantMortalityPer1000 = infantMort;
            this.healthcareIndex = health;
            this.educationIndex = edu;
            this.safetyIndex = safety;
            this.currencyCode = currCode;
            this.currencySymbol = currSym;
            this.flagEmoji = flag;
            this.description = desc;
            this.endemicRisks = risks ?? new List<string>();
        }
    }
}
