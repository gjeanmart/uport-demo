import { Connect, SimpleSigner } from 'uport-connect'
import kjua from 'kjua'

console.log("#############################");
console.log("Starting application ...");

const uport = new Connect('Greg', {
  clientId: '2op3cpAsan94qcDtt1F2R8NKqFZWvMdf8VW',
  network: 'rinkeby',
  signer: SimpleSigner('5bcdc8236f475a32e738ad12b36ada34a90f06a2c577a02c189a088757aa87c5')
})

const web3 = uport.getWeb3()
export { web3, uport }

console.log("#############################");

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('public').style.display = 'block';
  document.getElementById('private').style.display = 'none';

});



window.login = () => {
  

  console.log("#############################");
  console.log("Login ...");

  // Only allow button click once
  document.getElementById('loginBtn').disabled = true;
  
  uport.requestCredentials(
    {
      requested: ['name', 'avatar', 'phone', 'country'],
      notifcations: true
    },
    (uri) => {
      
      const qr = kjua({
        text: uri,
        fill: '#0619ac',
        size: 300,
        back: 'rgba(255,255,255,1)'
      })

      // Create wrapping link for mobile touch
      let aTag = document.createElement('a')
      aTag.href = uri

      // Nest QR in <a> and inject
      aTag.appendChild(qr)
      document.querySelector('#kqr').appendChild(aTag)
    }).then((userProfile) => {
    
      console.log({userProfile})

      function toHex(s) {
          var hex = "";
          for(var i=0;i<s.length;i++) { hex += ""+s.charCodeAt(i).toString(16); }
          return `0x${hex}`;
      }
     
      var message = "toto";
      var data = toHex(message);
      web3.currentProvider.sendAsync({ id: 1, method: 'personal_sign', params: [this.web3.eth.accounts[0], data] },
      function(err, data) {
        let sig = data.result;
        console.log("signature="+sig);
      })  
    
    document.getElementById('public').style.display = 'none';
    document.getElementById('private').style.display = 'block';
  })

}
    