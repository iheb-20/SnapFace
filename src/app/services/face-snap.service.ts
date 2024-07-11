import {Injectable} from "@angular/core";
import {FaceSnap} from "../models/face-snap.model";
import {HttpClient} from "@angular/common/http";
import {map, Observable, switchMap} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class FaceSnapService {


    constructor(private http: HttpClient) {
    }

    faceSnaps: FaceSnap[] = [];

    getAllFaceSnaps(): Observable<FaceSnap[]> {
        return this.http.get<FaceSnap[]>('http://localhost:3000/faceSnaps');
    }

    getFaceSnapById(faceSnapId: number): Observable<FaceSnap> {
        return this.http.get<FaceSnap>(`http://localhost:3000/faceSnaps/${faceSnapId}`);
    }


    snapFaceSnapById(faceSnapId: number, snapType: 'snap' | 'unsnap'): Observable<FaceSnap> {
        return this.getFaceSnapById(faceSnapId).pipe(
            map(faceSnap => ({
                ...faceSnap,
                snaps: faceSnap.snaps + (snapType === 'snap' ? 1 : -1)
            })),
            switchMap(updatedFaceSnap => this.http.put<FaceSnap>(`http://localhost:3000/faceSnaps/${faceSnapId}`, updatedFaceSnap)
            ));

    }

    addFaceSnap(formValue: { title: string, description: string, imageUrl: string, location?: string }): Observable<FaceSnap> {
        return this.getAllFaceSnaps().pipe(
            map(faceSnaps => faceSnaps.length),
            map(id => ({
                id,
                title: formValue.title,
                description: formValue.description,
                imageUrl: formValue.imageUrl,
                location: formValue.location,
                createdDate: new Date(),
                snaps: 0
            })),
            )

    }
}

