// Importing the libraries
import * as THREE from "three";
import "remixicon/fonts/remixicon.css";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import vertexShader from "./shaders/Imghover/vertex.glsl";
import fragmentShader from "./shaders/Imghover/fragment.glsl";
// import Swiper from "swiper/bundle";
// import "swiper/css/bundle";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Page2 Animation
const page2Animation = () => {
  gsap.to(".page2-video>video", {
    width: "100%",
    scrollTrigger: {
      scroller: "body",
      trigger: "#page2",
      start: "top 85%",
      end: "top 0%",
      // markers: true,
      scrub: 1,
    },
  });
};

page2Animation();

// Page 3 Animation
const page3Animation = () => {
  class Sketch {
    constructor(options) {
      this.time = 0;
      this.scene = new THREE.Scene();
      this.container = options.dom;
      this.width = this.container.offsetWidth;
      this.height = this.container.offsetHeight;

      this.camera = new THREE.PerspectiveCamera(
        70,
        this.width / this.height,
        100,
        2000
      );
      this.camera.position.z = 600;
      this.camera.fov = 2 * Math.atan(this.height / 2 / 600) * (180 / Math.PI);
      this.scene.add(this.camera);

      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
      this.container.appendChild(this.renderer.domElement);

      this.clock = new THREE.Clock();
      this.materials = [];
      this.meshes = [];
      this.changeImg = null;

      this.lenis = new Lenis();
      this.lenis.stop();

      this.addImages();
      this.render();
      this.resize();
      this.setupResize();
      this.setPosition();
    }

    setPosition() {
      this.imageStore.forEach((o) => {
        o.mesh.position.x = o.left - this.width / 2 + o.width / 2;
        o.mesh.position.y =
          -o.top + this.height / 2 - o.height / 2 + this.lenis.animatedScroll;
      });
    }

    setupResize() {
      window.addEventListener("resize", this.resize.bind(this));
    }

    resize() {
      this.height = this.container.offsetHeight;
      this.width = this.container.offsetWidth;
      this.camera.aspect = this.width / this.height;
      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
      this.camera.updateProjectionMatrix();

      this.camera.fov = 2 * Math.atan(this.height / 2 / 600) * (180 / Math.PI);

      this.imageStore.forEach((i) => {
        const bounds = i.img.getBoundingClientRect();
        i.mesh.scale.set(bounds.width, bounds.height, 1);
        i.top = bounds.top + this.lenis.animatedScroll;
        i.left = bounds.left;
        i.width = bounds.width;
        i.height = bounds.height;
      });
    }

    addImages() {
      const images = [...document.querySelectorAll(".webgl")];

      this.geometry = new THREE.PlaneGeometry(1, 1, 10, 10);
      this.material = new THREE.ShaderMaterial({
        uniforms: {
          uTexture1: new THREE.Uniform(0),
          uTexture2: new THREE.Uniform(0),
          time: new THREE.Uniform(0),
          hoverState: new THREE.Uniform(0),
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        // wireframe: true,
      });

      this.materials = [];

      this.changedTextures = ["imgs/pg3_2.jpeg", "imgs/pg3_1.jpeg"];
      const textureLoader = new THREE.TextureLoader();

      const loadedChangedTextures = this.changedTextures.map((texture) => {
        const t = textureLoader.load(texture);
        return t;
      });

      this.imageStore = images.map((img, index) => {
        const bonds = img.getBoundingClientRect();

        const texture = new THREE.Texture(img);
        texture.needsUpdate = true;

        const material = this.material.clone();
        material.uniforms.uTexture1.value = texture;

        this.materials.push(material);

        const mesh = new THREE.Mesh(this.geometry, material);
        mesh.scale.set(bonds.width, bonds.height, 1);
        this.scene.add(mesh);

        img.addEventListener("mouseenter", () => {
          material.uniforms.uTexture2.value = loadedChangedTextures[index];
          gsap.to(material.uniforms.hoverState, {
            value: 1,
          });
        });

        img.addEventListener("mouseleave", () => {
          gsap.to(material.uniforms.hoverState, {
            value: 0,
          });
        });

        return {
          img: img,
          mesh: mesh,
          width: bonds.width,
          height: bonds.height,
          top: bonds.top + this.lenis.animatedScroll,
          left: bonds.left,
        };
      });
    }
    render(time) {
      this.time = this.clock.getElapsedTime();

      this.materials.forEach((m) => {
        m.uniforms.time.value = this.time;
      });

      if (this.lenis) {
        this.lenis.start();
        this.lenis.raf(time);
        this.setPosition();
      }

      this.renderer.render(this.scene, this.camera);

      window.requestAnimationFrame(this.render.bind(this));
    }
  }

  new Sketch({ dom: document.querySelector(".container-canvas") });

  var tl2 = gsap.timeline({
    scrollTrigger:{
      trigger:"#pg3-lower",
      scroller:"body",
      // markers:true,
      start:"top 100%",
      end:"top 80%",
      scrub:1
    }
  })
  tl2
  .to("#page3",{
    backgroundColor:"black"
  },"a")
  .to("#page3 h1",{
    color:"white"
  },"a")
};

page3Animation();

function canvas(){
  
  const canvas = document.querySelector("canvas");
  const context = canvas.getContext("2d");
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  
  window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
  });
  
  function files(index) {
    var data = `
       ./canvas/canvas (1).png
      ./canvas/canvas (2).png
      ./canvas/canvas (3).png
      ./canvas/canvas (4).png
      ./canvas/canvas (5).png
      ./canvas/canvas (6).png
      ./canvas/canvas (7).png
      ./canvas/canvas (8).png
      ./canvas/canvas (9).png
      ./canvas/canvas (10).png
      ./canvas/canvas (11).png
      ./canvas/canvas (12).png
      ./canvas/canvas (13).png
      ./canvas/canvas (14).png
      ./canvas/canvas (15).png
      ./canvas/canvas (16).png
      ./canvas/canvas (17).png
      ./canvas/canvas (18).png
      ./canvas/canvas (19).png
      ./canvas/canvas (20).png
      ./canvas/canvas (21).png
      ./canvas/canvas (22).png
      ./canvas/canvas (23).png
      ./canvas/canvas (24).png
      ./canvas/canvas (25).png
      ./canvas/canvas (26).png
      ./canvas/canvas (27).png
      ./canvas/canvas (28).png
      ./canvas/canvas (29).png
      ./canvas/canvas (30).png
      ./canvas/canvas (31).png
      ./canvas/canvas (32).png
      ./canvas/canvas (33).png
      ./canvas/canvas (34).png
      ./canvas/canvas (35).png
      ./canvas/canvas (36).png
      ./canvas/canvas (37).png
      ./canvas/canvas (38).png
      ./canvas/canvas (39).png
      ./canvas/canvas (40).png
      ./canvas/canvas (41).png
      ./canvas/canvas (42).png
      ./canvas/canvas (43).png
      ./canvas/canvas (44).png
      ./canvas/canvas (45).png
      ./canvas/canvas (46).png
      ./canvas/canvas (47).png
      ./canvas/canvas (48).png
      ./canvas/canvas (49).png
      ./canvas/canvas (50).png
      ./canvas/canvas (51).png
      ./canvas/canvas (52).png
      ./canvas/canvas (53).png
      ./canvas/canvas (54).png
      ./canvas/canvas (55).png
      ./canvas/canvas (56).png
      ./canvas/canvas (57).png
      ./canvas/canvas (58).png
      ./canvas/canvas (59).png
      ./canvas/canvas (60).png
      ./canvas/canvas (61).png
      ./canvas/canvas (62).png
      ./canvas/canvas (63).png
      ./canvas/canvas (64).png
      ./canvas/canvas (65).png
      ./canvas/canvas (66).png
      ./canvas/canvas (67).png
      ./canvas/canvas (68).png
      ./canvas/canvas (69).png
      ./canvas/canvas (70).png
      ./canvas/canvas (71).png
      ./canvas/canvas (72).png
      ./canvas/canvas (73).png
      ./canvas/canvas (74).png
      ./canvas/canvas (75).png
      ./canvas/canvas (76).png
      ./canvas/canvas (77).png
      ./canvas/canvas (78).png
      ./canvas/canvas (79).png
      ./canvas/canvas (80).png
      ./canvas/canvas (81).png
      ./canvas/canvas (82).png
      ./canvas/canvas (83).png
      ./canvas/canvas (84).png
      ./canvas/canvas (85).png
      ./canvas/canvas (86).png
      ./canvas/canvas (87).png
      ./canvas/canvas (88).png
      ./canvas/canvas (89).png
      ./canvas/canvas (90).png
      ./canvas/canvas (91).png
      ./canvas/canvas (92).png
      ./canvas/canvas (93).png
      ./canvas/canvas (94).png
      ./canvas/canvas (95).png
      ./canvas/canvas (96).png
      ./canvas/canvas (97).png
      ./canvas/canvas (98).png
      ./canvas/canvas (99).png
      ./canvas/canvas (100).png
      ./canvas/canvas (101).png
      ./canvas/canvas (102).png
      ./canvas/canvas (103).png
      ./canvas/canvas (104).png
      ./canvas/canvas (105).png
      ./canvas/canvas (106).png
      ./canvas/canvas (107).png
      ./canvas/canvas (108).png
      ./canvas/canvas (109).png
      ./canvas/canvas (110).png
      ./canvas/canvas (111).png
      ./canvas/canvas (112).png
      ./canvas/canvas (113).png
      ./canvas/canvas (114).png
      ./canvas/canvas (115).png
      ./canvas/canvas (116).png
      ./canvas/canvas (117).png
      ./canvas/canvas (118).png
      ./canvas/canvas (119).png
      ./canvas/canvas (120).png
      ./canvas/canvas (121).png
      ./canvas/canvas (122).png
      ./canvas/canvas (123).png
      ./canvas/canvas (124).png
      ./canvas/canvas (125).png
      ./canvas/canvas (126).png
      ./canvas/canvas (127).png
      ./canvas/canvas (128).png
      ./canvas/canvas (129).png
      ./canvas/canvas (130).png
      ./canvas/canvas (131).png
      ./canvas/canvas (132).png
      ./canvas/canvas (133).png
      ./canvas/canvas (134).png
      ./canvas/canvas (135).png
      ./canvas/canvas (136).png
      ./canvas/canvas (137).png
      ./canvas/canvas (138).png
      ./canvas/canvas (139).png
      ./canvas/canvas (140).png
      ./canvas/canvas (141).png
      ./canvas/canvas (142).png
      ./canvas/canvas (143).png
      ./canvas/canvas (144).png
      ./canvas/canvas (145).png
      ./canvas/canvas (146).png
      ./canvas/canvas (147).png
      ./canvas/canvas (148).png
      ./canvas/canvas (149).png
      ./canvas/canvas (150).png
      ./canvas/canvas (151).png
      ./canvas/canvas (152).png
      ./canvas/canvas (153).png
      ./canvas/canvas (154).png
      ./canvas/canvas (155).png
      ./canvas/canvas (156).png
      ./canvas/canvas (157).png
      ./canvas/canvas (158).png
      ./canvas/canvas (159).png
      ./canvas/canvas (160).png
      ./canvas/canvas (161).png
      ./canvas/canvas (162).png
      ./canvas/canvas (163).png
      ./canvas/canvas (164).png
      ./canvas/canvas (165).png
      ./canvas/canvas (166).png
      ./canvas/canvas (167).png
      ./canvas/canvas (168).png
      ./canvas/canvas (169).png
      ./canvas/canvas (170).png
      ./canvas/canvas (171).png
      ./canvas/canvas (172).png
      ./canvas/canvas (173).png
      ./canvas/canvas (174).png
      ./canvas/canvas (175).png
      ./canvas/canvas (176).png
      ./canvas/canvas (177).png
      ./canvas/canvas (178).png
      ./canvas/canvas (179).png
      ./canvas/canvas (180).png
      ./canvas/canvas (181).png
      ./canvas/canvas (182).png
      ./canvas/canvas (183).png
      ./canvas/canvas (184).png
      ./canvas/canvas (185).png
      ./canvas/canvas (186).png
      ./canvas/canvas (187).png
      ./canvas/canvas (188).png
      ./canvas/canvas (189).png
      ./canvas/canvas (190).png
      ./canvas/canvas (191).png
      ./canvas/canvas (192).png
      ./canvas/canvas (193).png
      ./canvas/canvas (194).png
      ./canvas/canvas (195).png
      ./canvas/canvas (196).png
      ./canvas/canvas (197).png
      ./canvas/canvas (198).png
      ./canvas/canvas (199).png
      ./canvas/canvas (200).png
      ./canvas/canvas (201).png
      ./canvas/canvas (202).png
      ./canvas/canvas (203).png
      ./canvas/canvas (204).png
      ./canvas/canvas (205).png
      ./canvas/canvas (206).png
   `;
    return data.split("\n")[index];
  }
  
  const frameCount = 206;
  
  const images = [];
  const imageSeq = {
    frame: 1,
  };
  
  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = files(i);
    images.push(img);
  }
  var ctl = gsap.timeline({
    scrollTrigger: {
      scrub: 0.15,
      trigger: `#canvas-card>canvas`,
      //   set start end according to preference
      start: `top top`,
      end: `300% top`,
      scroller: `body`,
    }
  })
  ctl
  .to(imageSeq, {
    frame: frameCount - 1,
    snap: "frame",
    ease: `none`,
    onUpdate: render,
  })
  .to(canvas,{
    transform: "scale(.2)",
    top: "11%",
    left: "-2.3%",
    width:"88%"
  })
  .to(canvas,{
    opacity:0,
  })
  
  
  images[1].onload = render;
  
  function render() {
    scaleImage(images[imageSeq.frame], context);
  }
  
  function scaleImage(img, ctx) {
    var canvas = ctx.canvas;
    var hRatio = canvas.width / img.width;
    var vRatio = canvas.height / img.height;
    var ratio = Math.max(hRatio, vRatio);
    var centerShift_x = (canvas.width - img.width * ratio) / 2;
    var centerShift_y = (canvas.height - img.height * ratio) / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      centerShift_x,
      centerShift_y,
      img.width * ratio,
      img.height * ratio
    );
  }
  ScrollTrigger.create({
  
    trigger: "#canvas-card",
    pin: true,
    // markers:true,
    scroller: `body`,
  //   set start end according to preference
    start: `top top`,
    end: `300% top`,
  });
  
  }
  canvas()

const page5Animation = () => {
  var tl5 = gsap.timeline({
    scrollTrigger: {
      trigger: "#page5",
      scroller: "body",
      start: "0% 0%",
      end: "200% 0%",
      pin: true,
      scrub: 2,
      // markers: true
    }
  })

  tl5
  .to("#page5 #card3", {
    opacity: 0
  },"aa")
  .to("#page5 #circle-1", {
    backgroundColor: "transparent"
  },"aa")
  .to("#page5 #circle-2", {
    backgroundColor: "#000"
  },"aa")
  .from("#page5 #card2 .text-div h5", {
    transform: "translateY(100%)"
  },"a")
  .from("#page5 #card2 #video", {
    opacity: 0
  },"a")
  .from("#page5 #card2 .head-div h1", {
    transform: "translateY(100%)"
  },"a")
  .to("#page5 #card2", {
    opacity: 0
  },"bb")
  .to("#page5 #circle-2", {
    backgroundColor: "transparent"
  },"bb")
  .to("#page5 #circle-3", {
    backgroundColor: "#000"
  },"bb")
  .from("#page5 #card1 .text-div h5", {
    transform: "translateY(100%)"
  },"b")
  .from("#page5 #card1 #video", {
    opacity: 0
  },"b")
  .from("#page5 #card1 .head-div h1", {
    transform: "translateY(100%)"
  },"b")
  .from("#page5 #card1 .sub-head-div h3", {
    transform: "translateY(100%)"
  },"b")
}
page5Animation()


// Page 6 Animation
const page6Animation = () => {
  const page6Products = document.querySelector(".page6-products");

  // gsap.to(".page6-contianer", {
  //   scale: 0.97,
  //   scrollTrigger: {
  //     scroller: "body",
  //     trigger: ".page6-products",
  //     start: "top 0%",
  //     end: "top -100%",
  //     scrub: true,
  //   },
  // });

  page6Products.addEventListener("mousemove", (event) => {
    document.body.style.cursor = "none";
    gsap.to(".page6-product-cursor", {
      left: event.clientX - 350,
      top: event.clientY - 350,
      scale: 1,
    });
  });

  page6Products.addEventListener("mouseleave", (event) => {
    document.body.style.cursor = "initial";
    gsap.to(".page6-product-cursor", {
      scale: 0,
    });
  });

  let productFlag = "product1";

  const product1 = () => {
    const tl = gsap.timeline();
    tl.to(
      ".page6-contianer",
      {
        backgroundImage: "linear-gradient(to bottom right, #FB0408, #ba0407)", // set background color,
      },
      "a"
    )
      .to(
        ".page6-product-img1",
        {
          top: "-150%",
          opacity: 0,
          onComplete: () => {
            gsap.to(".page6-product-img1", {
              top: "100%",
            });
          },
        },
        "a"
      )
      .to(".page6-product-img2", {
        top: "-50%",
        opacity: 1,
      });
    productFlag = "product2";
  };

  const product2 = () => {
    const tl = gsap.timeline();
    tl.to(
      ".page6-contianer",
      {
        backgroundImage: "linear-gradient(to bottom right, #3c4ef3, #182ef3)", // set background color,
      },
      "a"
    )
      .to(
        ".page6-product-img2",
        {
          top: "-150%",
          opacity: 0,
          onComplete: () => {
            gsap.to(".page6-product-img2", {
              top: "100%",
            });
          },
        },
        "a"
      )
      .to(".page6-product-img1", {
        top: "-50%",
        opacity: 1,
      });
    productFlag = "product1";
  };

  page6Products.addEventListener("click", (event) => {
    if (productFlag === "product1") {
      product1();
      const tl = gsap.timeline();
      tl.to(".page6-product-cursor>h3", {
        text: "",
      });
      tl.to(".page6-product-cursor>h3", {
        text: "NEXT",
      });
    } else if (productFlag === "product2") {
      product2();
      const tl = gsap.timeline();
      tl.to(".page6-product-cursor>h3", {
        text: "",
      });
      tl.to(".page6-product-cursor>h3", {
        text: "NEXT",
      });
    }
  });
};

page6Animation();



