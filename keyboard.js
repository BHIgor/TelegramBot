const kb = require('./keyboard-buttons')

module.exports = {
    home:[
     [kb.home.glaza, kb.home.podpschik],
     [kb.home.avto],
     [kb.home.tarif, kb.home.keryvannya],
     [kb.home.profile,kb.home.qiwiKosh, kb.home.instruction]
    ],
    tarif:[
        [kb.tarif.day, kb.tarif.three],
        [kb.tarif.week, kb.tarif.month],
        [kb.tarif.back]
    ],
    blockhome:[
        [kb.blockhome.kupit, kb.blockhome.proba ],
        [kb.blockhome.podpschik, kb.blockhome.tarif],
        [kb.blockhome.qiwiKosh],
        [kb.blockhome.profile, kb.blockhome.instruction]
    ],
    profile:[
        [kb.profile.balance, kb.profile.tarif],
        [kb.back]
    ],
    yesornot:[
        [kb.yesornot.yes,kb.back],
    
    ],
    qiwiKosh:[
        [kb.home.qiwibuy],
        [kb.back]
    ],
    podpisota:[
        [kb.podpischik.qweek,kb.podpischik.slow],
        [kb.back]
    ],
    back:[
        [kb.back]
    ],
   

}