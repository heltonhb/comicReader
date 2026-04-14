---
phase: "03-admin-panel"
discovery: "complete"
stack: "firebase"
---

# Phase 3 Discovery

Research on Firebase Custom Claims and Storage operations required for Admin Panel implementation.

## Custom Claims

Firebase Custom Claims are stored in the user's ID token and verified via `getIdTokenResult()`.

**How to set claims (server-side):**
```javascript
const admin = require('firebase-admin');
await admin.auth().setCustomUserClaims(uid, { admin: true });
```

**How to read claims (client-side):**
```javascript
import { getAuth, getIdTokenResult } from 'firebase/auth';
const auth = getAuth();
const result = await getIdTokenResult(auth.currentUser);
const isAdmin = result.claims.admin === true;
```

**Important notes:**
- Claims are cached in token until refresh
- User must log out/in for new claims to take effect
- Claims should be verified server-side on API calls (not just client-side)

## Firebase Storage in Modular SDK

```javascript
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firebaseApp } from './firebase';

const storage = getStorage(firebaseApp);
const storageRef = ref(storage, 'volumes/volume1/page-01.jpg');
await uploadBytes(storageRef, fileBlob);
const url = await getDownloadURL(storageRef);
```

## Firestore CRUD Pattern

```javascript
import { collection, doc, addDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

const volumesCollection = collection(db, 'volumes');
await addDoc(volumesCollection, volumeData);
const snapshot = await getDocs(volumesCollection);
const volumeDoc = doc(db, 'volumes', volumeId);
await updateDoc(volumeDoc, { title: 'New Title' });
await deleteDoc(volumeDoc);
```

## Admin Panel UX

Reference UI patterns from Phase 2:
- Gold accent: #D4AF37
- Dark theme backgrounds
- Loading spinners with BookLoader pattern (from router.jsx)
- Form inputs with gold border on focus