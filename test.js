function testClassVerify(){
    var species = 'DF';
    var classBad = 'G17';
    var classGood = 'H3';

    Logger.log(verifyClass(species, classBad));
    Logger.log(verifyClass(species, classGood));
}