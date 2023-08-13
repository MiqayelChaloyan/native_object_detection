src/
CoCoClasses.json
ObjectDetector.js
screens/
├─ CameraScreen.js
├─ LoadingScreen.js
├─ ResultsScreen.js
App.js
package.json

screens/
The screens folder contains three files -- one for each screen of the object detection prototype we are building.

CameraScreen.js - A full screen camera view to capture the image we will run through our object detection model
LoadingScreen.js - A loading screen that let's the user know the image is being processed
ResultsScreen.js - A screen showing the image and the bounding boxes of the detected objects
App.js
This file manages which screen to show and helps pass data between them.

CoCoClasses.json
This file contains the labels for the different classes of objects that our model has been trained to detect.

ObjectDetector.js
This file will contain the code that actually runs our machine learning model.

package.json
This file contains a list of packages that our project depends on so the app knows to download them.



npm install --save react-native-pytorch-core

metro.config.js
// get defaults assetExts array
const defaultAssetExts = require('metro-config/src/defaults/defaults')
  .assetExts;

module.exports = {
  // ...

  resolver: {
    assetExts: [...defaultAssetExts, 'ptl'],
  },

  // ...
};

./android/gradle.properties
org.gradle.jvmargs=-Xmx4g

./android/app/build.gradle
android {
    // ...

    /**
     * Without the packaging options, it will result in the following build error:
     *
     * * What went wrong:
     * Execution failed for task ':app:mergeDebugNativeLibs'.
     * > A failure occurred while executing com.android.build.gradle.internal.tasks.Workers$ActionFacade
     *    > More than one file was found with OS independent path 'lib/x86/libfbjni.so'
     */
    packagingOptions {
        pickFirst '**/*.so'
    }
    sourceSets {
        main {
            jniLibs.srcDirs += ["$buildDir/extra-jniLibs/jni"]
        }
    }
    configurations {
        extraJNILibs
    }

    // ...
}

dependencies {
    // ...

    // Used to control the version of libfbjni.so packaged into the APK
    extraJNILibs("com.facebook.fbjni:fbjni:0.2.2")

    // ...
}

task extraJNILibs {
  doLast {
    configurations.extraJNILibs.files.each {
      def file = it.absoluteFile

      copy {
        from zipTree(file)
        into "$buildDir/extra-jniLibs" // temp location instead of "src/main/jniLibs"
        include "jni/**/*"
      }
    }
  }
}

tasks.whenTaskAdded { task ->
  if (task.name == 'mergeDebugJniLibFolders' || task.name == 'mergeReleaseJniLibFolders') {
    task.dependsOn(extraJNILibs)
  }
}

// ...
