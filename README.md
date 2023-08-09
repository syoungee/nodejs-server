이 글은 [IBM Take a tour of Node.js](https://developer.ibm.com/learningpaths/get-started-nodejs/explore-nodejs-architecture/)을 번역한 글입니다.✏️

NodeJS는 크롬의 V8 JavaScript 엔진을 기반으로 만들어진 JavaScript 런타임입니다.

<img src="../cluster/nodeJS_architecture.png"/>

## Node Runtime

Node 애플리케이션을 실제로 실행하는 구성 요소 집합입니다.

-   **node API** - 파일, 네트워크 I/O, 암호화 및 압축 등의 JavaScript utilities.
-   **node Core** - node API를 구현하는 JavaScript module set.
    (일부 모듈은 libuv와 다른 C++코드에 의존) - **JavaScript Engine, Chorome's V8 Engine** - JavaScript 코드를 로드, 최적화 및 실행할 수 있는 js to machine code 자바스크립트 컴파일러. - **Event Loop** - libuv라는 이벤트 기반 non-blocking I/O 라이브러리를 사용하여 구현되어 가볍고 효율적이며 확장 가능합니다.

### Node API

NodeJS에 의해 제공되는 빌트인 모듈의 조합

예시)
File System
Crypto
Events
HTTP
Stream

### Node Core

Node Core는 Node API에 C++ 프로그램을 더한 것으로, libuv(곧 설명할 예정) 및 JavaScript 엔진(Chrome V8, 다음 섹션에서 설명할 예정)과 바인딩되는 여러 라이브러리에 구축됩니다.

---

## Infrastructure

node runtime 인프라는 두 가지 구성 요소로 구성됩니다.

-   JavaScript engine
-   A non-blocking I/O library

### JavaScript Engine

Node에서 사용하는 JavaScript 엔진은 모든 JavaScript 코드(사용자가 작성한 것, Node API 및 npm 레지스트리에서 가져온 패키지의 모든 JavaScript)를 실행하는 Chrome의 V8 엔진입니다. NodeJS를 시작하면 V8 엔진의 단일 인스턴스가 실행됩니다. 이는 심각한 제한처럼 보일 수 있지만 보시다시피 Node는 이를 제대로 작동하게 합니다.

V8 엔진은 NodeJS와 같은 C++ 프로그램이나 Chrome과 같은 웹 브라우저에 임베드(또는 바인딩)될 수 있습니다. 이는 순수 JavaScript 라이브러리 외에도 V8을 V8과 바인딩하여 완전히 새로운 함수(또는 함수 템플릿)를 생성하도록 확장할 수 있음을 의미합니다. 새 함수가 등록되면 C++ 메서드에 대한 포인터가 전달되고 V8이 이러한 새 사용자 지정 JavaScript 함수 중 하나에서 실행될 때 해당 Template 메서드를 호출합니다. 이것은 어떻게 많은 수의 Node API의 I/O 함수가 Node Core에 구현되는 지에 대한 방법입니다.

##### 자바스크립트 엔진으로 V8만?(번외)

이론적으로 NodeJS는 모든 JavaScript엔진을 사용하도록 수정할 수 있지만 V8은 가장 기본 엔진입니다(V8에 매우 밀접하게 연결되어 있습니다). 즉, 다른 사람들은 V8에 대한 대안을 탐색했으며 다른 주요 JavaScript 엔진의 Node에 관심이 있다면 node-chakracore 프로젝트 및 spidernode 프로젝트를 확인해보세요. 언젠가는 JavaScript 엔진이 NodeJS의 플러그 가능한 구성 요소가 될 것이라고 예상합니다.

### 이벤트 루프

CPU 칩은 디스크, 네트워크와 같은 I/O 장치에서 데이터를 검색하는 것보다 훨씬 빠르게 프로그램의 명령을 실행할 수 있습니다. 그러나 이러한 I/O 장치가 제공하는 데이터가 없으면 프로그램이 제 역할을 할 수 없습니다. V8은 단일 스레드에서 실행되기 때문에 데이터를 사용할 수 있을 때까지 I/O 작업이 완료될 때까지 모든 것(사용자의 프로그램, 다른 프로그램, V8 엔진의 해당 인스턴스 또는 컨텍스트에서 실행 중인 모든 것)이 차단됩니다.

노드는 libuv를 이벤트 루프 구현으로 사용합니다. 노드 비동기 API를 사용하려면 콜백 함수를 해당 API 함수에 대한 인수로 전달하고 이벤트 루프 중에 콜백이 실행됩니다.

이벤트 루프는 콜백이 호출되는 다양한 단계로 구성됩니다.

-   타이머 단계(Timers phase): setInterval() 및 setTimeout() 만료 타이머 콜백이 실행됩니다.
-   폴링 단계(Poll phase): OS가 폴링되어 I/O 작업이 완료되었는지 확인하고 완료되면 해당 콜백이 실행됩니다.
-   확인 단계(Check phase): setImmediate() 콜백이 실행됩니다.

작성하는 JavaScript 코드는 두 가지 실행 "라인" 중 하나에서 실행됩니다.

-   메인라인: Node가 처음으로 프로그램을 실행할 때 실행되는 JavaScript입니다. 처음부터 끝까지 실행되며 완료되면 이벤트 루프에 대한 제어를 포기합니다.
-   이벤트 루프: 모든 콜백이 실행되는 곳입니다.
    일반적인 오해는 V8 및 이벤트 루프 콜백이 서로 다른 스레드에서 실행된다는 것입니다. 그렇지 않습니다. 모든 JavaScript 코드는 동일한 스레드에서 V8에 의해 실행됩니다.

Node가 V8을 사용하여 JavaScript 코드를 실행하는 방법에 대해 머리를 감쌀 때까지 이상한 타이밍 문제를 디버깅하려고 할 때 슬픔이 끝나지 않을 것입니다. 학습 경로를 진행하면서 이 점을 염두에 두십시오. 현실이 이벤트 루프의 멘탈 모델과 일치하지 않는 경우 멘탈 모델이 잘못되었기 때문일 수 있습니다. ~~괜찮습니다. 계속 작업하세요(기억하고 반복적으로 학습하세요).~~

**스레드 풀** - 이벤트 루프는 NodeJS가 논블로킹 I/O모델을 통해 확장성을 제공할 수 있도록 합니다. 만약 Node API가 I/O 집약적이 아닌 CPU 집약적인 기능을 제공한다고 가정 해보겠습니다. 이벤트 루프가 도움이 될까요?? 물론이죠! libuv는 worker pool(I/O 및 CPU 집약적 작업을 모두 오프로딩하는 thread pool)이라는 thread pool을 사용합니다.

---
