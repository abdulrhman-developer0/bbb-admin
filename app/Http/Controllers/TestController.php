<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TestController extends Controller
{
    public function store(Request $request)
    {
        $this->authorize('admin_group_operations_store');

        $bbb = new \App\Services\BBBService;
        $bbbMeeting = $bbb->createMeeting();
        // dd($bbbMeeting);

        $bbbMeetingId = $bbbMeeting['meetingID'];
        $bbbAttendeePW = $bbbMeeting['attendeePW'];
        $bbbModeratorPW = $bbbMeeting['moderatorPW'];
        $moderatorFullName = $meetingTime->meeting?->teacher?->full_name ?? 'Anon Moderator';
        $bbbModeratorLink = route('bbb.join', [$bbbMeetingId]) . "?name={$moderatorFullName}&password={$bbbModeratorPW}";

        GroupOperation::create([
            'name' => $request->name,
            'instructor_id' => $request->instructor,
            'course_id' => $request->course,
            'meeting_times_id' => $request->meetingTime,
            'group_type' => $request->group_type,
            'age_level' => $request->age_level,
            'study_level' => $request->study_level,
            'language' => $request->language,
            '' => $bbbMeetingId,
            'bbb_mbbb_meeting_idoderator_link' => $bbbModeratorLink,
            'bbb_moderator_pw' => $bbbModeratorPW,
            'bbb_attendee_pw' => $bbbAttendeePW
        ]);
        $meetingTime = MeetingTime::findOrFail($request->meetingTime);
        $meetingTime->update([
            'type' => 'group',
            'is_booked' => true,
        ]);

        $groupOperation = GroupOperation::paginate(10);
        return redirect()->route('adminGroupOperationsList')->with([
            'groupOperations' => $groupOperation
        ]);
    }
}