package com.hrms

import android.os.Build
import android.os.Bundle
import android.content.pm.PackageManager
import android.util.Base64
import android.util.Log
import java.security.MessageDigest

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

import expo.modules.ReactActivityDelegateWrapper

class MainActivity : ReactActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    // Set the theme to AppTheme BEFORE onCreate to support
    // coloring the background, status bar, and navigation bar.
    // This is required for expo-splash-screen.
    setTheme(R.style.AppTheme)
    super.onCreate(null)

    // ✅ Log the key hash for Facebook login
    try {
      val info = packageManager.getPackageInfo(
        packageName,
        PackageManager.GET_SIGNING_CERTIFICATES
      )
      val signatures = info.signingInfo.apkContentsSigners
      for (signature in signatures) {
        val md = MessageDigest.getInstance("SHA")
        md.update(signature.toByteArray())
        val keyHash = Base64.encodeToString(md.digest(), Base64.DEFAULT)
        Log.d("FacebookKeyHash", "KeyHash: $keyHash")
      }
    } catch (e: Exception) {
      e.printStackTrace()
    }
  }

  /**
   * Returns the name of the main component registered from JavaScript.
   */
  override fun getMainComponentName(): String = "main"

  /**
   * Returns the instance of the [ReactActivityDelegate].
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate {
    return ReactActivityDelegateWrapper(
      this,
      BuildConfig.IS_NEW_ARCHITECTURE_ENABLED,
      object : DefaultReactActivityDelegate(
        this,
        mainComponentName,
        fabricEnabled
      ) {}
    )
  }

  /**
   * Align the back button behavior with Android S.
   */
  override fun invokeDefaultOnBackPressed() {
    if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.R) {
      if (!moveTaskToBack(false)) {
        super.invokeDefaultOnBackPressed()
      }
      return
    }
    super.invokeDefaultOnBackPressed()
  }
}
