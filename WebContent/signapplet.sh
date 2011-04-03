#!/bin/bash
keytool -genkey -keystore yakitkeystore -alias yakit
keytool -selfcert -keystore yakitkeystore -alias yakit
jarsigner -keystore yakitkeystore yakitaudioapplet.jar yakit