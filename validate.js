function randNormalVec(d){
  const v = new Array(d);
  for(let i=0;i<d;i++){
    const u1 = Math.random() || 1e-9, u2 = Math.random();
    v[i] = Math.sqrt(-2*Math.log(u1))*Math.cos(2*Math.PI*u2);
  }
  return v;
}
function normalize(v){ const n=Math.sqrt(v.reduce((s,x)=>s+x*x,0))||1; return v.map(x=>x/n); }
function zeros(d){ return Array.from({length:d},()=>new Array(d).fill(0)); }
function outerAddInPlace(S,value,key){ const d=value.length; for(let i=0;i<d;i++) for(let j=0;j<d;j++) S[i][j]+=value[i]*key[j]; }
function matVec(S,k){ const d=k.length; const out=new Array(d).fill(0); for(let i=0;i<d;i++){let s=0; for(let j=0;j<d;j++) s+=S[i][j]*k[j]; out[i]=s;} return out; }
function cosine(a,b){ let dot=0,na=0,nb=0; for(let i=0;i<a.length;i++){dot+=a[i]*b[i];na+=a[i]*a[i];nb+=b[i]*b[i];} return dot/(Math.sqrt(na*nb)||1e-9); }

// TEST 1: d=2, orthonormal keys -> should retrieve perfectly
console.log("=== TEST 1: orthonormal keys, exact retrieval expected ===");
{
  const d=2;
  let S = zeros(d);
  const key1=[1,0], val1=[0.5,0.9];
  const key2=[0,1], val2=[-0.3,0.7];
  outerAddInPlace(S,val1,key1);
  outerAddInPlace(S,val2,key2);
  const r1 = matVec(S,key1);
  const r2 = matVec(S,key2);
  console.log("retrieved1:", r1, "expected:", val1, "cos:", cosine(r1,val1).toFixed(4));
  console.log("retrieved2:", r2, "expected:", val2, "cos:", cosine(r2,val2).toFixed(4));
}

// TEST 2: interference should grow (avg cos should decline) as random pairs stored, d small
console.log("\n=== TEST 2: interference curve, d=6, up to 18 pairs, averaged over 200 trials ===");
{
  const d = 6, maxPairs = 18, trials = 200;
  const sums = new Array(maxPairs).fill(0);
  for(let t=0;t<trials;t++){
    let S = zeros(d);
    let pairs = [];
    for(let n=1;n<=maxPairs;n++){
      const key = normalize(randNormalVec(d));
      const value = normalize(randNormalVec(d));
      outerAddInPlace(S,value,key);
      pairs.push({key,value});
      let total=0;
      for(const p of pairs){ total += cosine(matVec(S,p.key), p.value); }
      sums[n-1]+= total/pairs.length;
    }
  }
  for(let n=1;n<=maxPairs;n+=2){
    console.log("n="+n, "avg cos over trials =", (sums[n-1]/trials).toFixed(4));
  }
}
