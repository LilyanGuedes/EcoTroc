const { GPU } = require('gpu.js');

// Testar com CPU primeiro
const gpu = new GPU({ mode: 'cpu' });

const multiplyMatrix = gpu.createKernel(function(a) {
  return a[this.thread.x] * 2;
}).setOutput([5]);

const result = multiplyMatrix([1, 2, 3, 4, 5]);
console.log('✅ GPU.js funcionando!');
console.log('Resultado:', result);
console.log('Esperado: [2, 4, 6, 8, 10]');
