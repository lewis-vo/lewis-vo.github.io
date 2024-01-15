(() => {
  const createQuestions = (num, title, label1, key1, label2, key2) => {
    return {
      id: "q"+num,
      title: title,
      choices: [{label: label1, key:key1}, {label: label2, key:key2}],
    };
  };
  const calculateResults = (answers) => {
    for (let i = 0; i < answers.length; i++) {
      if (answers[i] == "E") counter.E++;
      if (answers[i] == "S") counter.S++;
      if (answers[i] == "T") counter.T++;
      if (answers[i] == "J") counter.J++;
    }
    let personality = `${(counter.E >=2) ? "E" : "I"}${(counter.S >=2) ? "S" : "N"}${(counter.T >=2) ? "T" : "F"}${(counter.J >=2) ? "J" : "P"}`;
    
    setTimeout(() => {
      window.location.href = `./assets/images/results/2x/${personality}.png`;
    }, 2700);
    return personality;
  };
  const mapRange = (number, inMin, inMax, outMin, outMax) => (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;

  const buildBlob = () => {
    let renderer = new THREE.WebGLRenderer({ canvas : document.getElementById('canvas'), antialias:true, alpha: true });
    // default bg canvas color //
    renderer.setClearColor(0x000000, 0);
    //  use device aspect ratio //
    renderer.setPixelRatio(window.devicePixelRatio);
    // set size of canvas within window //
    renderer.setSize(window.innerWidth, window.innerHeight*0.8);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth/(window.innerHeight*0.8), 0.1, 1000 );
    const light = new THREE.DirectionalLight( 0xffffff, 0.9 );
      light.position.set( 0.5, 1, 1 ).normalize();
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040))

    window.addEventListener("resize", () => {
      renderer.setSize(window.innerWidth, window.innerHeight*0.8);
      camera.aspect = window.innerWidth/(window.innerHeight*0.8);
      camera.updateProjectionMatrix();
    });
    camera.position.z = 5;
    
    const sphere_geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xA5A5A5),
      roughness: 0.5,
      metalness: 0.1,
      ior: 1.48,
      iridescence: 1,
      iridescenceIOR: 1.3,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      specularIntensity: 1,
      specularColor: new THREE.Color(0xffffff),
      sheen: 1,
      sheenRoughness: 0.2,
      sheenColor: new THREE.Color(0xFF85EF),
      transmission: 1,
    });
    const sphere = new THREE.Mesh(sphere_geometry, material);

    scene.add(sphere);
    const update = () => {
      // change '0.003' for more aggressive animation
      let time = performance.now() * (0.001*mapRange(currentQuestionIndex, 0, 11, 1, 3));

      // change 'k' value for more spikes
      let k = mapRange(2+currentQuestionIndex, 2, 13, 2, 5);
      let height = 0.4;
      let position = sphere.geometry.attributes.position;
      let p = new THREE.Vector3();
      for (let i = 0; i < position.count; i++) {
        p.fromBufferAttribute( position, i );
        p.normalize().multiplyScalar(1 + height*noise.perlin3(p.x * k + time, p.y * k, p.z * k));
        position.setXYZ(i, p.x, p.y, p.z);
      }
      sphere.geometry.computeVertexNormals();
      sphere.geometry.normalsNeedUpdate = true;
      sphere.geometry.verticesNeedUpdate = true;
      sphere.geometry.attributes.position.needsUpdate = true;
    };

    function animate() {
      sphere.rotation.x += 0.001;
      sphere.rotation.y += 0.001;
      update();
      /* render scene and camera */
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);  
  }
  const counter = {
    E: 0,
    S: 0,
    T: 0,
    J: 0,
  };
  /*
  const questions = [
    createQuestions(
      1, "You find yourself in an urban park filled with eccentric and interactive installations. Nearby, there's a gathering of people participating in a game. You would be...",
      "eager to join in, enthusiastically embracing the playful competition.", "E",
      "alone, exploring the park at your own pace, finding joy in the whimsical atmosphere itself.", "I",
    ),
    createQuestions(
      2, "Just right behind the entrance, you spot a giant piece of artwork that immediately catches your eye. You are...",
      "immediately drawn to its interesting composition and intricate details.", "S",
      "captivated by the artwork's abstract symbolism, pondering its deeper meaning.", "N",
    ),
    createQuestions(
      3, "You stumple upon the musical room of the installation in which you put on your shoes and dance to move across. You would...",
      "get lost in the abstract patterns and melodies, interpreting the music in a more introspective way.", "N",
      "find yourself immersed in the rhythm and beats, embracing the sensory experience of the music.", "S",
    ),
  createQuestions(
      4, "There's a trendy bar in the middle of the installation. The crowd there are people among your age who are very lively and chatty. You prefer...",
      "taking the backseat and observe the energy of the crowd, savoring the moment.", "I",
      "seizing this opportunity to make new connections and find new like-minded people.", "E",
    ),
    createQuestions(
      5, "Next to the bar, there is an art piece that is all about puzzles. It poses a riddle that is too interesting to ignore. In this case, you are...",
      "approaching the challenge with a logical mindset by analyzing patterns and finding.", "T",
      "listening to your instincts, allowing it to guide your problem-solving process.", "F",
    ),
    createQuestions(
      6, "You pass by a kinetic sculpture that somehow could move and talk. Its wise words call out to you and make you stop in your tracks. You would...",
      "ponder and ask questions to get to know about this strange installation sculpture.", "E",
      "keep quiet and listen to all of its ramblings, finding amusement it it alone.", "I",
    ),
    createQuestions(
      7, "In the technology hub, you encounter an installation designed to address a pressing urban challenge. You would...",
      "be inspired by the personal experiences shared, connecting with people through their story.", "F",
      "carefully examine the logic-driven method to gauge how can it solve the problem.", "T",
    ),
    createQuestions(
      8, "Near the exit, you notice a glass box that reads 'Lost and Found.' Inside, there are intruiging stuffs awaiting their owners. You would...",
      "steal glances and be drawn to the possibilities behind the lost belongings.", "N",
      "wonder about the logistics and how the lost items are organized.", "S",
    ),
    createQuestions(
      9, "You have reached the end of the wild installation with all sorts of thoughts. You are more likely to...",
      "evaluate the installation based on its innovation and originality, appreciating the artistic expression.", "T",
      "resonate more with the emotional resonance it elicits, finding beauty and meaning in its spiritual form.", "F",
    ),
  ];
  */
  const questions = [
    createQuestions(
      1, "When exploring a vibrant street market, you would...",
      "feel energized by the lively interactions with vendors and fellow shoppers.", "E",
      "quietly observe the vibrant array of sights and sounds.", "I",
    ),
    createQuestions(
      2, "In an urban art gallery, you came across an interesting artwork, you would...",
      "focus on the sense of imagination it gives you.", "N",
      "appreciate its precise details and realistic representations.", "S",
    ),
    createQuestions(
      3, "An upcoming bustling urban market, known for its unique vendors, is here in your town, you would...",
      "prepare to have a clear idea of what you want to buy and where to find it.", "J",
      "open to exploring and discovering new items along the way.", "P",
    ),
    createQuestions(
      4, "There's a new café popular among the youth. When you go there, you would notice...",
      "the buzz of conversations and social interactions.", "E",
      "a quiet corner to enjoy your own company.", "I",
    ),
    createQuestions(
      5, "At your workplace, you face with a challenging problem. You are more likely to...",
      "consider the emotional impact and seek harmony among team members.", "F",
      "prioritize logical analysis and objective decision-making.", "T",
    ),
    createQuestions(
      6, "You come across a vibrant art street with colorful murals. You would...",
      "find yourself lost in thought, contemplating the deeper meanings and messages they convey.", "N",
      "focus on the vivid visual elements and the details within.", "S",
    ),
    createQuestions(
      7, "When attending a lively music festival in the heart of the city, you prefer...",
      "finding a cozy spot to sit back and enjoy the music.", "I",
      "dancing and mingling with the crowd.", "E",
    ),
    createQuestions(
      8, "At an urban technology conference, you are drawn to..",
      "the practical applications and functionalities of the showcased innovations.", "S",
      "the futuristic possibilities and the big-picture impact.", "N",
    ),
    createQuestions(
      9, "Your friends just asked you to come to their spontaneous outing. You would...",
      "enjoy the flexibility and excitement of going with the flow.", "P",
      "ask if they could come up with a clear plan.", "J",
    ),
    createQuestions(
      10, "When exploring a dynamic installation with multiple activities happening simultaneously, you would...",
      "stick to your own schedule and making sure you experience everything you want.", "J",
      "embrace the unexpected and letting the installation guide your choices.", "P",
    ),
    createQuestions(
      11, "You go to this rooftop bar for the first time, you would...",
      "engage in lively conversations and meeting new people.", "E",
      "savor you drink by yourself and enjoy the surrounding atmosphere.", "I",
    ),
    createQuestions(
      12, "Coming across a college town with shops intertwining with universities, you would...",
      "appreciate the efficiency and organization that goes into its planning.", "T",
      "connect with the positive vibes and the sense of togetherness it fosters.", "F",
    ),
  ];
  buildBlob();

  window.currentQuestionIndex = 0;

  document.addEventListener('alpine:init', () => {
    Alpine.store('questions', questions);
    Alpine.store('calculateResults', calculateResults);
    Alpine.store('createQuestions', createQuestions);
  });
})();